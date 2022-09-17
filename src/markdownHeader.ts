// Copyright (C) 2022 Sebastien Guerri
//
// This file is part of markdown-header.
//
// markdown-header is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
//
// markdown-header is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with markdown-header. If not, see <https://www.gnu.org/licenses/>.

import * as vscode from 'vscode';
import * as path from 'path';
import * as yaml from 'yaml';

import * as utils from './extensionUtils';
import * as settings from './extensionSettings';

export class MarkdownHeaderProvider implements vscode.TreeDataProvider<number>
{

	private _onDidChangeTreeData: vscode.EventEmitter<number | undefined> = new vscode.EventEmitter<number | undefined>();
	readonly onDidChangeTreeData: vscode.Event<number | undefined> = this._onDidChangeTreeData.event;

	private editor: vscode.TextEditor | undefined;
	private header: any = {};
	private headerStart: vscode.Position = new vscode.Position(0, 0);
	private headerEnd: vscode.Position = new vscode.Position(0, 0);

	constructor(private context: vscode.ExtensionContext)
	{
		vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
		vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

		settings.load();
		vscode.workspace.onDidChangeConfiguration(() => settings.load());

		this.onActiveEditorChanged();
	}

	private onActiveEditorChanged(): void
	{
		if (vscode.window.activeTextEditor) {
			if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
				const enabled = vscode.window.activeTextEditor.document.languageId === 'markdown';
				vscode.commands.executeCommand('setContext', 'markdownHeaderEnabled', enabled);
				if (enabled) this.refresh();
				return;
			}
		}
		vscode.commands.executeCommand('setContext', 'markdownHeaderEnabled', false);
	}

	private onDocumentChanged(changeEvent: vscode.TextDocumentChangeEvent): void
	{
		if (settings.autoRefresh && changeEvent.document.uri.toString() === this.editor?.document.uri.toString()) {
			this.parseMarkdown();
			this._onDidChangeTreeData.fire(undefined);
		}
	}





	addHeader(): void
	{
		this.editor = vscode.window.activeTextEditor;
		if (this.editor && this.editor.document) {

			let header = '---\n';

			if (settings.initWithId) {
				header += `id: ${utils.generateId()}\n`;
			}

			let text = this.editor.document.getText();
			let title = this.editor.document.fileName;
			text.split('\n').every(line => {
				if (line.startsWith('# ')) {
					title = line.replace('# ', '');
					return false;
				}
				return true;
			});
			header += `title: ${title}\n`;

			header += '---\n\n';

			this.editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), header);
				this.refresh();
			});
		}
	}

	addItem(): void
	{
		let key = '';
		vscode.window.showInputBox({
			validateInput: (item) => Object.keys(this.header).includes(item) ? 'This key already exists' : '',
			placeHolder: 'Enter item key'
		}).then(value => {
			if (value) {
				key = value;
				return vscode.window.showInputBox({
					placeHolder: `Enter item value for ${value}`
				});
			}
		}).then(value => {
			if (value) {
				value = value.trim();
				if (value.toLowerCase() === 'true') {
					this.header[key] = true;
				} else if (value.toLowerCase() === 'false') {
					this.header[key] = false;
				} else if (parseInt(value)) {
					this.header[key] = parseInt(value);
				} else {
					this.header[key] = value;
				}
				this.updateMarkdown();
			}
		});
	}

	removeItem(offset: number): void
	{
		let key = Object.keys(this.header)[offset - 1];

		vscode.window.showQuickPick([ 'yes', 'no' ], {
			placeHolder: `Confirm deletion of ${key}`
		}).then(value => {
			if (value === 'yes') {
				delete this.header[key];
				this.updateMarkdown();
			}
		});
	}





	refresh(offset?: number): void
	{
		this.parseMarkdown();
		vscode.commands.executeCommand('setContext', 'markdownHeader.hasYaml', Object.keys(this.header).length !== 0);
		if (offset) {
			this._onDidChangeTreeData.fire(offset);
		} else {
			this._onDidChangeTreeData.fire(undefined);
		}
	}

	getTreeItem(offset: number): vscode.TreeItem
	{
		if (!this.editor) {
			throw new Error('Invalid editor');
		}

		let key = Object.keys(this.header)[offset - 1];
		let value = this.header[key];

		if (typeof value === 'string')
		{
			const treeItem: vscode.TreeItem = new vscode.TreeItem(value, vscode.TreeItemCollapsibleState.None);
			treeItem.description = key;
			treeItem.iconPath = this.getIcon(typeof value);
			treeItem.contextValue = ['id', 'title', 'date'].includes(key) ? key : 'string';
			return treeItem;
		}
		else if (typeof value === 'boolean')
		{
			const treeItem: vscode.TreeItem = new vscode.TreeItem(`is ${value ? '': 'not '}${key}`, vscode.TreeItemCollapsibleState.None);
			treeItem.iconPath = this.getIcon(typeof value);
			treeItem.contextValue = 'boolean';
			return treeItem;
		}
		else if (typeof value === 'number')
		{
			const treeItem: vscode.TreeItem = new vscode.TreeItem(`${key} = ${value}`, vscode.TreeItemCollapsibleState.None);
			treeItem.iconPath = this.getIcon(typeof value);
			treeItem.contextValue = 'number';
			return treeItem;
		}
		else if (Array.isArray(value))
		{
			const treeItem: vscode.TreeItem = new vscode.TreeItem(`${value.join(' | ')}`, vscode.TreeItemCollapsibleState.None);
			treeItem.description = key;
			treeItem.iconPath = this.getIcon('array');
			return treeItem;
		}
		else
		{
			const treeItem: vscode.TreeItem = new vscode.TreeItem(key, vscode.TreeItemCollapsibleState.None);
			treeItem.description = 'undefined';
			return treeItem;
		}
	}

	getChildren(offset?: number): Thenable<number[]>
	{
		let len = Object.keys(this.header).length;
		return Promise.resolve(Array.from(Array(len).keys(), n => n+1));
	}




	updateTitle(): void
	{
		if (!this.editor) return;
		if (!Object.keys(this.header).includes('title')) return;

		let text = this.editor.document.getText();
		let title = this.editor.document.fileName;
		text.split('\n').every(line => {
			if (line.startsWith('# ')) {
				title = line.replace('# ', '');
				return false;
			}
			return true;
		});

		this.header['title'] = title;
		this.updateMarkdown();
	}

	updateString(offset: number): void
	{
		let key = Object.keys(this.header)[offset - 1];
		let value = this.header[key];
		if (typeof value === 'string') {
			if (Object.keys(settings.choices).includes(key) && Array.isArray(settings.choices[key])) {
				vscode.window.showQuickPick(settings.choices[key], {
					placeHolder: `Select value for ${key}`
				}).then(value => {
					if (value) {
						this.header[key] = value;
						this.updateMarkdown();
					}
				});
			} else {
				vscode.window.showInputBox({
					placeHolder: `Input new value for ${key}`
				}).then(value => {
					if (value) {
						this.header[key] = value;
						this.updateMarkdown();
					}
				});
			}
		}
	}

	updateDate(offset: number): void
	{
		let key = Object.keys(this.header)[offset - 1];
		let value = this.header[key];
		if (typeof value === 'string') {
			vscode.window.showInputBox({
				validateInput: (value) => Date.parse(value) ? '' : 'Input must be a valid date',
				placeHolder: `Input new value for ${key}`
			}).then(value => {
				if (value) {
					this.header[key] = value;
					this.updateMarkdown();
				}
			});
		}
	}

	updateBoolean(offset: number): void
	{
		let key = Object.keys(this.header)[offset - 1];
		let value = this.header[key];
		if (typeof value === 'boolean') {
			this.header[key] = !value;
			this.updateMarkdown();
		}
	}

	updateNumber(offset: number): void
	{
		let key = Object.keys(this.header)[offset - 1];
		let value = this.header[key];
		if (typeof value === 'number') {
			let min : number | undefined = undefined;
			let max : number | undefined = undefined;
			if (Object.keys(settings.choices).includes(key)) {
				let details = settings.choices[key];
				if (typeof details === 'object') {
					if (Object.keys(details).includes('min')) {
						min = details['min'];
					}
					if (Object.keys(details).includes('max')) {
						max = details['max'];
					}
				}
			}

			let placeHolder = `Input new value for ${key}`;
			if (typeof min !== 'undefined' && typeof max !== 'undefined') {
				placeHolder += ` (between ${min} and ${max})`;
			} else if (typeof min !== 'undefined') {
				placeHolder += ` (greater than ${min})`;
			} else if (typeof max !== 'undefined') {
				placeHolder += ` (lower than ${max})`;
			}

			vscode.window.showInputBox({
				validateInput: (value) => {
					if (!parseInt(value)) return 'Input must be a number';
					let i = parseInt(value);
					if (typeof min !== 'undefined' && i < min) return `Input must be greater than ${min}`;
					if (typeof max !== 'undefined' && i > max) return `Input must be lower than ${max}`;
				},
				placeHolder: placeHolder
			}).then(value => {
				if (value) {
					this.header[key] = parseInt(value);
					this.updateMarkdown();
				}
			});
		}
	}






	private parseMarkdown(): void
	{
		this.header = {};
		this.editor = vscode.window.activeTextEditor;
		if (this.editor && this.editor.document) {
			let text = this.editor.document.getText();

			let index = 0;
			let yamlHeader = '';
			let yamlDone = false;
			text.split('\n').every(line => {
				if (index === 0 && line !== '---') {
					return false;
				} else if (index !== 0 && line === '---') {
					this.headerStart = new vscode.Position(1, 0);
					this.headerEnd = new vscode.Position(index, 0);
					yamlDone = true;
					return false;
				} else if (index !== 0) {
					yamlHeader += line;
					yamlHeader += '\n';
				}
				index += 1;
				return true;
			});

			this.header = yamlDone ? yaml.parse(yamlHeader) : {};
		}
	}

	private updateMarkdown(): void
	{
		this.editor = vscode.window.activeTextEditor;
		if (this.editor && this.editor.document) {
			this.editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Range(this.headerStart, this.headerEnd), yaml.stringify(this.header));
				this.refresh();
			});
		}
	}




	private getIcon(type: string): any
	{
		if (type === 'boolean') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'boolean.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'boolean.svg'))
			};
		}
		if (type === 'string') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'string.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'string.svg'))
			};
		}
		if (type === 'number') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'number.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'number.svg'))
			};
		}
		if (type === 'array') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'json.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'json.svg'))
			};
		}
		return null;
	}

}
