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

'use strict';

import * as vscode from 'vscode';

import { MarkdownHeaderProvider } from './markdownHeader';

export function activate(context: vscode.ExtensionContext)
{
	const markdownHeaderProvider = new MarkdownHeaderProvider(context);
	
	vscode.commands.executeCommand('setContext', 'markdownHeader.hasYaml', false);

	vscode.window.registerTreeDataProvider('markdownHeader', markdownHeaderProvider);
	
	vscode.commands.registerCommand('markdownHeader.addHeader', () => markdownHeaderProvider.addHeader());
	vscode.commands.registerCommand('markdownHeader.refresh', () => markdownHeaderProvider.refresh());
	vscode.commands.registerCommand('markdownHeader.addItem', () => markdownHeaderProvider.addItem());
	vscode.commands.registerCommand('markdownHeader.removeItem', offset => markdownHeaderProvider.removeItem(offset));
	vscode.commands.registerCommand('markdownHeader.updateTitle', () => markdownHeaderProvider.updateTitle());
	vscode.commands.registerCommand('markdownHeader.updateString', offset => markdownHeaderProvider.updateString(offset));
	vscode.commands.registerCommand('markdownHeader.updateDate', offset => markdownHeaderProvider.updateDate(offset));
	vscode.commands.registerCommand('markdownHeader.updateBoolean', offset => markdownHeaderProvider.updateBoolean(offset));
	vscode.commands.registerCommand('markdownHeader.updateNumber', offset => markdownHeaderProvider.updateNumber(offset));
}
