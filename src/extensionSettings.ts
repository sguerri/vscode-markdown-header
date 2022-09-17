import * as vscode from 'vscode';

export let autoRefresh: boolean = false;
export let choices: any = {};

export function load(): void
{
	autoRefresh = vscode.workspace.getConfiguration('markdownHeader').get('autorefresh', false);
	choices = vscode.workspace.getConfiguration('markdownHeader').get('choices', {});
}