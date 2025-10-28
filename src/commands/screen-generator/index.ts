import * as vscode from 'vscode';
import { FigmaMcpClient } from './figma-mcp-client';
import { LLM } from './LLM';
import { buildPrompt } from './prompts'

export const generateScreen = async () => {
  const nodeId = await vscode.window.showInputBox({ prompt: 'Ingresa node-id' }) || '';
  const figmaMcpClient = new FigmaMcpClient(nodeId);
  const llm = new LLM();

  await figmaMcpClient.connect();
  const { codeConnectMap, designContext } = await figmaMcpClient.getFigmaContextWithCodeConnect();
  const prompt = buildPrompt({ codeConnectMap, designContext });
  const output = await llm.sendRequest(prompt);

  const doc = await vscode.workspace.openTextDocument({ content: output, language: 'typescriptreact' });
  vscode.window.showTextDocument(doc);
};
