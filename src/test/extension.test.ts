import * as assert from "assert";
import path from "path";
import os from "os";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", async () => {
    // Create a temp file in the temp directory
    const uri = vscode.Uri.parse("untitled:test-" + Date.now() + ".txt");
    // await vscode.workspace.fs.writeFile(
    //   uri,
    //   new TextEncoder().encode("Hello World")
    // );

    const doc = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(
      doc,
      vscode.ViewColumn.One,
      false
    );
    await editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(0, 0), "https://www.google.com");
    });

    // Move the cursor to the position where the URL is
    const position = new vscode.Position(0, 5); // replace with your position
    editor.selection = new vscode.Selection(position, position);

    // Trigger the hover
    await vscode.commands.executeCommand("editor.action.showHover");

    // Get the hover information
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      "vscode.executeHoverProvider",
      doc.uri,
      position
    );

    // Check the hover message
    assert.ok(hovers.length > 0);
    assert.ok(hovers[0].contents.length > 0);
    assert.strictEqual(hovers[0].contents[0], "Expected tooltip"); // replace with your expected tooltip
  });
});
