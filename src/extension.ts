// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('extension "url-title-preview" is now active!');

  context.subscriptions.push(
    vscode.languages.registerHoverProvider({ scheme: "file" }, { provideHover })
  );
}

const linkPattern = /(http|https):\/\/[^\s]*\b/g;
const provideHover = async (
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<vscode.Hover> => {
  const range = document.getWordRangeAtPosition(position, linkPattern);
  if (!range) {
    // @ts-ignore - docs allow returning null
    return null;
  }

  const url = document.getText(range);
  const title = await fetchTitle(url);
  return new vscode.Hover(`Title: ${title}`);
};

const fetchTitle = async (url: string): Promise<string> => {
  const res = await axios.get(url);
  const match = res.data.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : url;
};

// This method is called when your extension is deactivated
export function deactivate() {}
