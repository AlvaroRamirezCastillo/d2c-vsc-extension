// llm.ts
import * as vscode from 'vscode';
import {
  figmaDesignContextTool,
  figmaCodeConnectMapTool,
  figmaScreenshotTool,
  FigmaDesignContextInput,
  FigmaCodeConnectMapInput,
  FigmaScreenshotInput,
} from './figmaTool';
import { FigmaMcpClient } from './figma-mcp-client';

export class LLM {
  // === MODO SIMPLE: SIN TOOLS (tu método original) ===
  async sendRequest(content: string) {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot' });
    const prompt = [vscode.LanguageModelChatMessage.User(content)];

    const response = await model.sendRequest(
      prompt,
      {},
      new vscode.CancellationTokenSource().token
    );

    let out = '';
    for await (const chunk of response.text) out += chunk;

    return out;
  }

  // === MODO AVANZADO: CON TOOLS DE FIGMA ===
  async sendRequestWithFigmaTools(content: string): Promise<string> {
    const [model] = await vscode.lm.selectChatModels({
      vendor: 'copilot',
      family: 'claude-4-5-sonnet',
    });

    const cts = new vscode.CancellationTokenSource();
    const token = cts.token;

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(content),
    ];

    const options: vscode.LanguageModelChatRequestOptions = {
      justification: 'Design-to-code usando el MCP server de Figma.',
      tools: [
        figmaDesignContextTool,
        figmaCodeConnectMapTool,
        figmaScreenshotTool,
      ],
      toolMode: vscode.LanguageModelChatToolMode.Auto,
    };

    const response = await model.sendRequest(messages, options, token);

    let finalText = '';

    // 1ª vuelta: dejamos que el modelo decida si llama a alguna tool
    for await (const part of response.stream) {
      if (part instanceof vscode.LanguageModelTextPart) {
        // Texto normal del modelo
        finalText += part.value;
      } else if (part instanceof vscode.LanguageModelToolCallPart) {
        // El modelo quiere llamar a una tool
        const call = part;

        // Creamos una respuesta en función del nombre de la tool
        let resultJson = '{}';

        // OJO: aquí uso tu FigmaMcpClient "grande" que llama a las 3 tools
        // Si quieres, luego lo refinamos para hacer métodos separados.
        if (call.name === 'get_figma_context') {
          // Si sigues usando la tool antigua "figmaContextTool"
          const input = call.input as { nodeId: string };
          const figmaClient = new FigmaMcpClient(input.nodeId);
          const toolResult = await figmaClient.getFigmaContextWithCodeConnect();
          resultJson = JSON.stringify(toolResult);
        } else if (call.name === 'get_figma_design_context') {
          const input = call.input as FigmaDesignContextInput;
          const figmaClient = new FigmaMcpClient(input.nodeId);
          const toolResult = await figmaClient.getFigmaContextWithCodeConnect();
          // Si quieres, aquí podrías devolver solo toolResult.designContext
          resultJson = JSON.stringify(toolResult.designContext ?? toolResult);
        } else if (call.name === 'get_figma_code_connect_map') {
          const input = call.input as FigmaCodeConnectMapInput;
          const figmaClient = new FigmaMcpClient(input.nodeId);
          const toolResult = await figmaClient.getFigmaContextWithCodeConnect();
          resultJson = JSON.stringify(toolResult.codeConnectMap ?? toolResult);
        } else if (call.name === 'get_figma_screenshot') {
          const input = call.input as FigmaScreenshotInput;
          const figmaClient = new FigmaMcpClient(input.nodeId);
          const toolResult = await figmaClient.getFigmaContextWithCodeConnect();
          resultJson = JSON.stringify(toolResult.screenshot ?? toolResult);
        } else {
          // Tool desconocida: devolvemos algo mínimo
          resultJson = JSON.stringify({
            error: `Tool desconocida: ${call.name}`,
          });
        }

        // Construimos los mensajes para la 2ª llamada:
        // - Assistant: contiene el tool call (para que el modelo sepa qué se ejecutó)
        // - User: contiene el resultado del tool como ToolResultPart
        const toolCallMessage = vscode.LanguageModelChatMessage.Assistant([
          call, // LanguageModelToolCallPart
        ]);

        const toolResultPart = new vscode.LanguageModelToolResultPart(
          call.callId, // <- IMPORTANTE: callId, no id
          [new vscode.LanguageModelTextPart(resultJson)]
        );

        const toolResultMessage = vscode.LanguageModelChatMessage.User([
          toolResultPart,
        ]);

        const followupResponse = await model.sendRequest(
          [
            vscode.LanguageModelChatMessage.User(content),
            toolCallMessage,
            toolResultMessage,
          ],
          {
            justification:
              'Responder usando el resultado de las tools de Figma.',
          },
          token
        );

        let followupText = '';
        for await (const followPart of followupResponse.stream) {
          if (followPart instanceof vscode.LanguageModelTextPart) {
            followupText += followPart.value;
          }
        }

        return followupText.trim();
      }
    }

    // Si el modelo nunca llamó a ninguna tool, devolvemos lo que haya escrito
    return finalText.trim();
  }
}
