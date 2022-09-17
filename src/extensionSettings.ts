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

/**
 * Automatic refresh of header panel on file modification
 */
export let autoRefresh: boolean = false;

/**
 * Predefined options by header key
 */
export let choices: any = {};

/**
 * When creating a new YAML header, add a random id
 */
export let initWithId: boolean = false;

/**
 * Load settings
 */
export function load(): void
{
	autoRefresh = vscode.workspace.getConfiguration('markdownHeader').get('autorefresh', false);
	choices = vscode.workspace.getConfiguration('markdownHeader').get('choices', {});
	initWithId = vscode.workspace.getConfiguration('markdownHeader').get('initWithId', false);
}