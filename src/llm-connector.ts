import * as vscode from 'vscode';

export function connectLLM(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('d2c-extension.callCopilot', async () => {
      vscode.window.showInformationMessage('connecting...');
      const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot' });
      if (!model) {
        vscode.window.showErrorMessage('No hay modelos de Copilot disponibles.');
        return;
      }

      const prompt = [
        vscode.LanguageModelChatMessage.User(
          'Genera un componente Angular con inputs `label` y `value` y test básico.'
        ),
      ];

      const response = await model.sendRequest(prompt, {}, new vscode.CancellationTokenSource().token);
      let out = '';
      for await (const chunk of response.text) out += chunk;
      vscode.window.showInformationMessage('Respuesta Copilot:\n' + out.slice(0, 300));
    })
  );
}
