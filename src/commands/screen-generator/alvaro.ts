import * as vscode from 'vscode';
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIMessage, BaseMessage } from "@langchain/core/messages";

export class CopilotLangChainChatModel extends BaseChatModel {
  _llmType(): string {
    return "vscode-copilot";
  }

  // LangChain llamará a este método internamente
  protected async _generate(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    _runManager?: any
  ) {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot' });

    const userContent = messages
      .map(m => m.content)
      .join('\n');

    const prompt = [vscode.LanguageModelChatMessage.User(userContent)];

    const response = await model.sendRequest(
      prompt,
      {},
      new vscode.CancellationTokenSource().token
    );

    let out = '';
    for await (const chunk of response.text) out += chunk;

    return {
      generations: [
        [
          {
            text: out,
            message: new AIMessage(out),
          }
        ]
      ]
    };
  }
}
