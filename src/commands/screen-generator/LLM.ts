import * as vscode from 'vscode';

export class LLM {
  async sendRequest(content: string) {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot' });
    const prompt = [vscode.LanguageModelChatMessage.User(content)];

    const response = await model.sendRequest(prompt, {}, new vscode.CancellationTokenSource().token);

    let out = '';
    for await (const chunk of response.text) out += chunk;

    return out;
  }
}
