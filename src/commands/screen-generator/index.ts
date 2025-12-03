import * as vscode from 'vscode';
import { FigmaMcpClient } from './figma-mcp-client';
import { LLM } from './LLM';
import { buildPrompt } from './prompts'
import { promises as fs } from 'fs';
import path from 'path';

export const generateScreen = async () => {
  // const nodeId = await vscode.window.showInputBox({ prompt: 'Ingresa node-id' }) || '';
  // const figmaMcpClient = new FigmaMcpClient(nodeId);
  // const llm = new LLM();
  // await figmaMcpClient.connect();

  // const { codeConnectMap, designContext } = await figmaMcpClient.getFigmaContextWithCodeConnect();
  // const prompt = buildPrompt({ codeConnectMap, designContext });

  // const output = await llm.sendRequest(prompt);
  // const doc = await vscode.workspace.openTextDocument({ content: output, language: 'typescriptreact' });

  const llm = new LLM();

  const prompt = `
Eres un asistente de design-to-code para React Native con TypeScript.

Tienes acceso a tools de Figma que te dan:
- Contexto de diseño (designContext)
- Code connect map
- Screenshot

Paso 1: si necesitas entender el diseño, llama a las tools de Figma usando el node-id=1278-34582.
Paso 2: genera un componente de React Native en TypeScript que represente ese diseño.

Requisitos de implementación:
- Usa React Native, no React web.
- Declara el componente como función: \`const Component: React.FC<Props> = (...)\`.
- Usa \`StyleSheet.create\` para todos los estilos.
- Evita estilos en línea e importa siempre \`StyleSheet\` de 'react-native'.
- Define la interfaz \`Props\` con tipos estrictos de TypeScript.
- Devuelve sólo el código final en formato .tsx, sin explicaciones adicionales.
`;

  const code = await llm.sendRequestWithFigmaTools(prompt);

  writeFileWithDirs('/Users/alvaro/Downloads/alvaro11.tsx', code);
};

async function writeFileWithDirs(filePath: any, content: any) {
  const dir = path.dirname(filePath);

  // Crea el directorio (y subdirectorios) si no existen
  await fs.mkdir(dir, { recursive: true });

  // Escribe el archivo
  await fs.writeFile(filePath, content, 'utf8');
}
