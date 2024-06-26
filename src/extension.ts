// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from 'axios';
import * as vscode from 'vscode';
import * as cache from './cache';
import { MetaTags, getMetaTags } from './meta-tags';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('extension "url-title-preview" is now active!');

  context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, { provideHover }));
}

const linkPattern = /(http|https):\/\/[^\s]*\b/g;
const provideHover = async (document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover> => {
  const range = document.getWordRangeAtPosition(position, linkPattern);
  if (!range) {
    // @ts-ignore - docs allow returning null
    return null;
  }

  const url = document.getText(range);

  try {
    const hoverContent = await cache.getOrCreate(url, () => fetchUrlContent(url));
    console.log(hoverContent.value);

    // Cache hover content for the URL
    const vsHoverContent = new vscode.Hover(hoverContent);
    return vsHoverContent;
  } catch (error) {
    console.error('Error fetching URL data:', error);
    const errorMassage = 'Unable to fetch URL data. Please try again later.';
    return new vscode.Hover(errorMassage);
  }
};

const fetchUrlContent = async (url: string) => {
  const response = await axios.get(url);
  const meta = getMetaTags(response.data);
  const hoverContent = formatHover(meta);

  return hoverContent;
};

const formatHover = (meta: MetaTags) => {
  const lines = [];
  if (meta.title) {
    lines.push(`**${meta.title}**`);
  }
  if (meta.description) {
    lines.push(meta.description);
  }
  if (meta.image) {
    const width = calculateLengthOfImage(lines);
    lines.push(`<img src="${meta.image}" alt="${meta.title}" width="${width}" />`);
  }
  const content = new vscode.MarkdownString('$(globe) ' + lines.join('  \n'), true);
  content.supportHtml = true;
  return content;
};

const maxImageWidth = 200;
const calculateLengthOfImage = (rows: string[]) => {
  if (rows.length === 0) {
    return maxImageWidth;
  }

  const longestRow = rows.reduce((a, b) => (a.length > b.length ? a : b));
  return Math.min(longestRow.length * 7, maxImageWidth);
};

// This method is called when your extension is deactivated
export function deactivate() {
  cache.clear();
}
