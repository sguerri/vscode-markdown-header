import * as vscode from 'vscode';

export let autoRefresh: boolean = false;
export let choices: any = {};
export let initWithId: boolean = false;

export function load(): void
{
	autoRefresh = vscode.workspace.getConfiguration('markdownHeader').get('autorefresh', false);
	choices = vscode.workspace.getConfiguration('markdownHeader').get('choices', {});
	initWithId = vscode.workspace.getConfiguration('markdownHeader').get('initWithId', false);
}