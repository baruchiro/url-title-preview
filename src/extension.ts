// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "url-title-preview" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "url-title-preview.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from VSCode!");
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: "file" },
      new URLHoverProvider()
    )
  );
}

class URLHoverProvider implements vscode.HoverProvider {
  private _linkPattern = /(http|https):\/\/[^\s]*\b/g;

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, this._linkPattern);
    if (!range) {
      // @ts-ignore - docs allow returning null
      return null;
    }

    const url = document.getText(range);
    const title = await this._fetchTitle(url);
    return new vscode.Hover(`Title: ${title}`);
  }

  private async _fetchTitle(url: string): Promise<string> {
    const res = await axios.get(url);
    const match = res.data.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : url;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
