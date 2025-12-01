// vscodeCopilotChatModel.ts
import * as vscode from 'vscode';

import {
  SimpleChatModel,
  type BaseChatModelCallOptions,
} from '@langchain/core/language_models/chat_models';
import {
  AIMessage,
  type BaseMessage,
} from '@langchain/core/messages';

import { LLM } from './llm'; // tu clase anterior

type CopilotCallOptions = BaseChatModelCallOptions & {
  // aquí podrías añadir opciones propias (temperature, etc)
};

export class VSCodeCopilotChatModel extends SimpleChatModel<CopilotCallOptions> {
  // Guardamos una instancia de tu clase LLM
  constructor(private readonly llm: LLM) {
    super({});
  }

  // Solo para identificación en logs / LangSmith
  _llmType(): string {
    return 'vscode-copilot';
  }

  /**
   * Método clave: dado un array de mensajes de LangChain,
   * llamamos a tu LLM y devolvemos un AIMessage.
   */
  protected async _call(
    messages: BaseMessage[],
    _options: this['ParsedCallOptions']
  ): Promise<AIMessage> {
    // Aquí puedes decidir cómo convertir el historial de mensajes a un prompt.
    // Para algo simple: concatenar todos los mensajes en texto plano:
    const promptText = messages
      .map((m) => {
        const role = m._getType(); // "system" | "human" | "ai" ...
        return `${role.toUpperCase()}: ${m.content}`;
      })
      .join('\n');

    // Usar tu wrapper actual
    const answer = await this.llm.sendRequest(promptText);

    // Devolver un mensaje de respuesta de LangChain
    return new AIMessage(answer);
  }
}
