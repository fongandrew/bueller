import * as fs from 'node:fs/promises';
/**
 * Parses an issue markdown file and extracts the conversation history
 *
 * @param filePath - Absolute path to the issue file
 * @returns Parsed issue with message history
 * @throws Error if file cannot be read or if the format is invalid
 */
export async function readIssue(filePath) {
    let rawContent;
    try {
        rawContent = await fs.readFile(filePath, 'utf-8');
    }
    catch (error) {
        throw new Error(`Failed to read issue file at ${filePath}: ${String(error)}`);
    }
    return parseIssueContent(rawContent);
}
/**
 * Parses issue content and extracts the conversation history
 *
 * @param content - Raw markdown content of the issue file
 * @returns Parsed issue with message history
 */
export function parseIssueContent(content) {
    const messages = [];
    // Split by the separator (---)
    const sections = content.split(/\n---\n/);
    let messageIndex = 0;
    for (const section of sections) {
        const trimmedSection = section.trim();
        // Skip empty sections
        if (!trimmedSection) {
            continue;
        }
        // Check if this section starts with @user: or @claude:
        const userMatch = trimmedSection.match(/^@user:\s*([\s\S]*)$/);
        const claudeMatch = trimmedSection.match(/^@claude:\s*([\s\S]*)$/);
        if (userMatch) {
            messages.push({
                index: messageIndex++,
                author: 'user',
                content: userMatch[1].trim(),
            });
        }
        else if (claudeMatch) {
            messages.push({
                index: messageIndex++,
                author: 'claude',
                content: claudeMatch[1].trim(),
            });
        }
        // If no match, skip this section (handles malformed sections)
    }
    return {
        messages,
        rawContent: content,
    };
}
/**
 * Gets the latest message from an issue
 *
 * @param issue - Parsed issue object
 * @returns The most recent message, or undefined if no messages exist
 */
export function getLatestMessage(issue) {
    if (issue.messages.length === 0) {
        return undefined;
    }
    return issue.messages[issue.messages.length - 1];
}
/**
 * Gets all messages from a specific author
 *
 * @param issue - Parsed issue object
 * @param author - Author to filter by ('user' or 'claude')
 * @returns Array of messages from the specified author
 */
export function getMessagesByAuthor(issue, author) {
    return issue.messages.filter((msg) => msg.author === author);
}
/**
 * Formats a message for appending to an issue file
 *
 * @param author - Author of the message ('user' or 'claude')
 * @param content - Content of the message
 * @returns Formatted message string ready to append to an issue file
 */
export function formatMessage(author, content) {
    return `---\n\n@${author}: ${content}`;
}
//# sourceMappingURL=issue-reader.js.map