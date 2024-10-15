// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Bookmark, BookmarkProvider } from './bookmarkProvider';

let bookmarkProvider: BookmarkProvider;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	bookmarkProvider = new BookmarkProvider();
    vscode.window.createTreeView('projectBookmarks', { treeDataProvider: bookmarkProvider });

    let addBookmark = vscode.commands.registerCommand('extension.addBookmark', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const line = editor.selection.active.line + 1;
            const file = editor.document.fileName;
            const text = editor.document.getText(new vscode.Range(line, 0, line + 1, 0));

            bookmarkProvider.addBookmark(file, line, text);
            vscode.window.showInformationMessage(`Закладка добавлена в ${file}:${line}`);
        }
    });

	let removeBookmark = vscode.commands.registerCommand('extension.removeBookmark', (bookmark: Bookmark) => {
		bookmarkProvider.removeBookmark(bookmark.bookmark);
		vscode.window.showInformationMessage(`Закладка удалена: ${bookmark.label}`);
	});

	let goToBookmark = vscode.commands.registerCommand('extension.goToBookmark', async (bookmark: Bookmark) => {
		const { file, line } = bookmark.bookmark;

		const document = await vscode.workspace.openTextDocument(vscode.Uri.file(file));
		await vscode.window.showTextDocument(document);
	
		const position = new vscode.Position(line, 0);
		vscode.window.activeTextEditor?.revealRange(new vscode.Range(position, position));
    });

    context.subscriptions.push(addBookmark);
    context.subscriptions.push(removeBookmark);
    context.subscriptions.push(goToBookmark);
}

// This method is called when your extension is deactivated
export function deactivate() {}
