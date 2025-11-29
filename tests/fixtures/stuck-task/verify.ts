import {
	assertFileContains,
	assertFileExists,
	assertFileMatches,
	assertFileNotExists,
	pass,
} from '../../verify-utils.js';

// Check that the issue was moved to stuck
assertFileExists(
	'issues/stuck/p1-001-impossible.md',
	'FAIL: Issue not moved to stuck directory',
);

// Check that the issue is not in open
assertFileNotExists(
	'issues/open/p1-001-impossible.md',
	'FAIL: Issue still in open directory',
);

// Check that there's a @claude response explaining why it's stuck
assertFileContains(
	'issues/stuck/p1-001-impossible.md',
	'@claude:',
	'FAIL: Issue does not have a @claude response',
);

assertFileMatches(
	'issues/stuck/p1-001-impossible.md',
	/(stuck|cannot|unable|impossible)/i,
	"FAIL: @claude response does not explain why it's stuck",
);

pass('Task correctly marked as stuck');
