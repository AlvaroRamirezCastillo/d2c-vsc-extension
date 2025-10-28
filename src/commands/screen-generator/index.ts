import * as vscode from 'vscode';
import { FigmaMcpClient } from './figma-mcp-client';
import { LLM } from './LLM';
import { buildPrompt } from './prompts'

export const generateScreen = async () => {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generando componente desde Figma...",
      cancellable: false
    },
    async (progress) => {
      progress.report({ increment: 0, message: "Conectando con MCP Server..." });

      const nodeId = await vscode.window.showInputBox({ prompt: 'Ingresa node-id' }) || '';
      const figmaMcpClient = new FigmaMcpClient(nodeId);
      const llm = new LLM();
      await figmaMcpClient.connect();

      progress.report({ increment: 40, message: "Obteniendo contexto del diseño..." });

      const { codeConnectMap, designContext } = await figmaMcpClient.getFigmaContextWithCodeConnect();
      const prompt = buildPrompt({ codeConnectMap, designContext });

      progress.report({ increment: 80, message: "Generando código con Copilot..." });

      const output = await llm.sendRequest(prompt);
      const doc = await vscode.workspace.openTextDocument({ content: output, language: 'typescriptreact' });
      vscode.window.showTextDocument(doc);

      progress.report({ increment: 100, message: "Listo ✅" });
      vscode.window.showInformationMessage("Componente generado exitosamente.");
    }
  );
};
