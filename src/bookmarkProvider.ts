import * as vscode from 'vscode';

export type BookmarkData = {
    file: string;
    line: number;
    text: string;
}

export class BookmarkProvider implements vscode.TreeDataProvider<Bookmark> {
    private _onDidChangeTreeData: vscode.EventEmitter<Bookmark | void> = new vscode.EventEmitter<Bookmark | void>();
    readonly onDidChangeTreeData: vscode.Event<Bookmark | void> = this._onDidChangeTreeData.event;

    private bookmarks: BookmarkData[] = [];

    constructor() {}

    public addBookmark(file: string, line: number, text: string) {
        const newBookmark: BookmarkData = { file, line, text };
        this.bookmarks.push(newBookmark);
        this._onDidChangeTreeData.fire();
    }

    public removeBookmark(bookmark: BookmarkData) {
        this.bookmarks = this.bookmarks.filter(b => b.file !== bookmark.file || b.line !== bookmark.line);
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Bookmark): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Bookmark): Thenable<Bookmark[]> {
        return Promise.resolve(this.bookmarks.map(b => new Bookmark(b)));
    }
}

export class Bookmark extends vscode.TreeItem {
    constructor(public readonly bookmark: BookmarkData) {
        super(bookmark.file, vscode.TreeItemCollapsibleState.None);
        this.label = `${bookmark.file}:${bookmark.line}`;
        this.description = bookmark.text;
        this.tooltip = bookmark.text;
        this.iconPath = new vscode.ThemeIcon('bookmark');
        this.command = {
            command: 'extension.goToBookmark',
            title: 'Go to Bookmark',
            arguments: [this],
        };
        this.contextValue = 'bookmarkItem';
    }

    contextMenuCommands() {
        return [
            {
                command: 'extension.removeBookmark',
                title: 'Delete Bookmark',
                arguments: [this]
            }
        ];
    }
}