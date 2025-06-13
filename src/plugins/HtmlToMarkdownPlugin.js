import TurndownService from 'turndown';

const turndownService = new TurndownService();

export function convertToMarkdown(htmlString) {
    return turndownService.turndown(htmlString);
}
