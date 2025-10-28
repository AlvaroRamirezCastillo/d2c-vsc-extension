import * as vscode from 'vscode';
import { generateScreen } from './commands/screen-generator';

export function activate(context: vscode.ExtensionContext) {
	const generateScreenCommand = vscode.commands.registerCommand('d2c.generate-screen', async () => {
		await generateScreen();
	});

	context.subscriptions.push(generateScreenCommand);
}

export function deactivate() { }
