#!/usr/bin/env tsx

import { execSync, spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output
const colors = {
	red: '\x1b[0;31m',
	green: '\x1b[0;32m',
	yellow: '\x1b[1;33m',
	reset: '\x1b[0m',
};

interface TestResult {
	name: string;
	passed: boolean;
	error?: string;
	timeout?: boolean;
}

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const FIXTURES_DIR = path.join(PROJECT_ROOT, 'tests', 'fixtures');
const TEMP_BASE = path.join(PROJECT_ROOT, '.test-tmp');

async function buildProject(): Promise<void> {
	console.log('Building bueller...');
	try {
		execSync('npm run build', {
			cwd: PROJECT_ROOT,
			stdio: 'inherit',
		});
	} catch (error) {
		console.error(`${colors.red}FAIL: Build failed${colors.reset}`);
		process.exit(1);
	}

	const buelerPath = path.join(PROJECT_ROOT, 'dist', 'bueller.js');
	if (!fs.existsSync(buelerPath)) {
		console.error(
			`${colors.red}FAIL: Build did not produce dist/bueller.js${colors.reset}`,
		);
		process.exit(1);
	}

	console.log(`${colors.green}Build successful${colors.reset}\n`);
}

function copyDirectory(src: string, dest: string): void {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const entries = fs.readdirSync(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			copyDirectory(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

async function runBuellerWithTimeout(
	testTemp: string,
	timeoutMs: number,
): Promise<{ exitCode: number; output: string; timedOut: boolean }> {
	return new Promise((resolve) => {
		const outputFile = path.join(testTemp, 'bueller.output.txt');
		const output: string[] = [];

		const child = spawn(
			'node',
			[
				'bueller.js',
				'--issues-dir',
				'./issues',
				'--max-iterations',
				'10',
			],
			{
				cwd: testTemp,
				stdio: 'pipe',
			},
		);

		let timedOut = false;
		const timeout = setTimeout(() => {
			timedOut = true;
			child.kill('SIGTERM');
		}, timeoutMs);

		child.stdout?.on('data', (data) => {
			output.push(data.toString());
		});

		child.stderr?.on('data', (data) => {
			output.push(data.toString());
		});

		child.on('close', (code) => {
			clearTimeout(timeout);
			const fullOutput = output.join('');
			fs.writeFileSync(outputFile, fullOutput);
			resolve({
				exitCode: code ?? 1,
				output: fullOutput,
				timedOut,
			});
		});

		child.on('error', (error) => {
			clearTimeout(timeout);
			const errorOutput = `Error: ${error.message}`;
			fs.writeFileSync(outputFile, errorOutput);
			resolve({
				exitCode: 1,
				output: errorOutput,
				timedOut: false,
			});
		});
	});
}

async function runTest(testName: string): Promise<TestResult> {
	const testDir = path.join(FIXTURES_DIR, testName);

	if (!fs.existsSync(testDir)) {
		return {
			name: testName,
			passed: false,
			error: `Test directory not found: ${testDir}`,
		};
	}

	const verifyScript = path.join(testDir, 'verify.ts');
	if (!fs.existsSync(verifyScript)) {
		return {
			name: testName,
			passed: false,
			error: `verify.ts not found in ${testDir}`,
		};
	}

	console.log(`${colors.yellow}Running test: ${testName}${colors.reset}`);

	// Create temp directory for this test
	const testTemp = path.join(TEMP_BASE, testName);
	if (fs.existsSync(testTemp)) {
		fs.rmSync(testTemp, { recursive: true, force: true });
	}
	fs.mkdirSync(testTemp, { recursive: true });

	// Copy the built script
	fs.copyFileSync(
		path.join(PROJECT_ROOT, 'dist', 'bueller.js'),
		path.join(testTemp, 'bueller.js'),
	);

	// Copy node_modules (need Claude SDK)
	copyDirectory(
		path.join(PROJECT_ROOT, 'node_modules'),
		path.join(testTemp, 'node_modules'),
	);

	// Copy the test fixture
	const setupDir = path.join(testDir, 'setup');
	if (!fs.existsSync(setupDir)) {
		return {
			name: testName,
			passed: false,
			error: `setup directory not found in ${testDir}`,
		};
	}

	copyDirectory(setupDir, path.join(testTemp, 'issues'));

	// Run bueller with timeout
	const { timedOut, output } = await runBuellerWithTimeout(testTemp, 60000);

	if (timedOut) {
		console.log(
			`${colors.red}TIMEOUT: Test took longer than 60 seconds${colors.reset}\n`,
		);
		return {
			name: testName,
			passed: false,
			timeout: true,
		};
	}

	// Run verification script
	try {
		execSync(`tsx "${verifyScript}"`, {
			cwd: testTemp,
			stdio: 'pipe',
			encoding: 'utf-8',
		});

		console.log(`${colors.green}PASS: ${testName}${colors.reset}\n`);
		return {
			name: testName,
			passed: true,
		};
	} catch (error) {
		const outputFile = path.join(testTemp, 'bueller.output.txt');
		console.log(`${colors.red}FAIL: ${testName}${colors.reset}`);
		console.log(`Output saved to: ${outputFile}`);
		console.log('');

		return {
			name: testName,
			passed: false,
			error:
				error instanceof Error ? error.message : 'Verification failed',
		};
	}
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const specificTest = args[0];

	// Build the project
	await buildProject();

	// Clean up old test runs
	if (fs.existsSync(TEMP_BASE)) {
		fs.rmSync(TEMP_BASE, { recursive: true, force: true });
	}
	fs.mkdirSync(TEMP_BASE, { recursive: true });

	// Track results
	const results: TestResult[] = [];

	if (specificTest) {
		// Run specific test
		const result = await runTest(specificTest);
		results.push(result);
	} else {
		// Run all tests
		console.log(`Discovering tests in ${FIXTURES_DIR}...`);

		if (!fs.existsSync(FIXTURES_DIR)) {
			console.error(
				`${colors.red}ERROR: Fixtures directory not found: ${FIXTURES_DIR}${colors.reset}`,
			);
			process.exit(1);
		}

		const testDirs = fs
			.readdirSync(FIXTURES_DIR, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);

		if (testDirs.length === 0) {
			console.log(
				`${colors.yellow}WARNING: No test fixtures found in ${FIXTURES_DIR}${colors.reset}`,
			);
			console.log(
				'Create test fixtures to get started. See tests/README.md for details.',
			);
			process.exit(0);
		}

		for (const testName of testDirs) {
			const result = await runTest(testName);
			results.push(result);
		}
	}

	// Print summary
	const total = results.length;
	const passed = results.filter((r) => r.passed).length;
	const failed = total - passed;
	const failedTests = results.filter((r) => !r.passed);

	console.log('================================');
	console.log('Test Results');
	console.log('================================');
	console.log(`Total:  ${total}`);
	console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
	console.log(`${colors.red}Failed: ${failed}${colors.reset}`);

	if (failed > 0) {
		console.log('');
		console.log('Failed tests:');
		for (const test of failedTests) {
			const suffix = test.timeout ? ' (timeout)' : '';
			console.log(`  - ${test.name}${suffix}`);
		}
		console.log('');
		console.log(`Test artifacts preserved in: ${TEMP_BASE}`);
		process.exit(1);
	} else {
		console.log('');
		console.log(`${colors.green}All tests passed!${colors.reset}`);
		process.exit(0);
	}
}

main().catch((error) => {
	console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
	process.exit(1);
});
