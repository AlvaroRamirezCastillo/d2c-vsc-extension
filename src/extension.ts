import * as vscode from 'vscode';
import { generateScreen } from './commands/screen-generator';

export function activate(context: vscode.ExtensionContext) {
	const generateScreenCommand = vscode.commands.registerCommand('d2c.generate-screen', async () => {
		//await generateScreen();


		const session = await vscode.authentication.getSession(
			'github',                      // providerId
			['read:user', 'user:email'],   // scopes mínimos que necesitas
			{ createIfNone: true }         // si no hay sesión, pide login
		);

		// Datos de la cuenta
		console.log(session.account.label);     // nombre de usuario
		console.log(session.accessToken);


	});

	context.subscriptions.push(generateScreenCommand);
}

export function deactivate() { }
