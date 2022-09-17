'use strict';

import * as vscode from 'vscode';

import { MarkdownHeaderProvider } from './markdownHeader';

export function activate(context: vscode.ExtensionContext)
{
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	const markdownHeaderProvider = new MarkdownHeaderProvider(context);
	
	vscode.commands.executeCommand('setContext', 'markdownHeader.hasYaml', false);

	vscode.window.registerTreeDataProvider('markdownHeader', markdownHeaderProvider);
	vscode.commands.registerCommand('markdownHeader.addHeader', () => markdownHeaderProvider.addHeader());
	vscode.commands.registerCommand('markdownHeader.refresh', () => markdownHeaderProvider.refresh());
	vscode.commands.registerCommand('markdownHeader.addItem', () => markdownHeaderProvider.addItem());
	vscode.commands.registerCommand('markdownHeader.removeItem', offset => markdownHeaderProvider.removeItem(offset));
	vscode.commands.registerCommand('markdownHeader.updateString', offset => markdownHeaderProvider.updateString(offset));
	vscode.commands.registerCommand('markdownHeader.updateDate', offset => markdownHeaderProvider.updateDate(offset));
	vscode.commands.registerCommand('markdownHeader.updateBoolean', offset => markdownHeaderProvider.updateBoolean(offset));
	vscode.commands.registerCommand('markdownHeader.updateNumber', offset => markdownHeaderProvider.updateNumber(offset));
}
