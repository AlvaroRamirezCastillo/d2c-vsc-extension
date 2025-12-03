// figmaTool.ts
import * as vscode from 'vscode';

export interface FigmaDesignContextInput {
  nodeId: string;
}

export interface FigmaCodeConnectMapInput {
  nodeId: string;
  clientLanguages?: string;
  clientFrameworks?: string;
}

export interface FigmaScreenshotInput {
  nodeId: string;
  format?: 'png' | 'jpeg';
  scale?: number;
}

// Tool 1: get_design_context
export const figmaDesignContextTool: vscode.LanguageModelChatTool = {
  name: 'get_figma_design_context',
  description: `
    Obtiene el design context de un nodo de Figma usando el MCP server.
    Úsalo cuando necesites información estructural del layout y sus propiedades.
  `,
  inputSchema: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'ID del nodo de Figma en formato "123:456" (sin guiones).'
      }
    },
    required: ['nodeId']
  }
};

// Tool 2: get_code_connect_map
export const figmaCodeConnectMapTool: vscode.LanguageModelChatTool = {
  name: 'get_figma_code_connect_map',
  description: `
    Obtiene el code connect map de un nodo de Figma para clientLanguages y clientFrameworks dados.
    Úsalo cuando quieras mapear componentes de diseño a componentes de código.
  `,
  inputSchema: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'ID del nodo de Figma en formato "123:456" (sin guiones).'
      },
      clientLanguages: {
        type: 'string',
        description: 'Lenguajes de cliente, por ejemplo "typescript".',
        default: 'typescript'
      },
      clientFrameworks: {
        type: 'string',
        description: 'Frameworks de cliente, por ejemplo "react".',
        default: 'react'
      }
    },
    required: ['nodeId']
  }
};

// Tool 3: get_screenshot
export const figmaScreenshotTool: vscode.LanguageModelChatTool = {
  name: 'get_figma_screenshot',
  description: `
    Obtiene un screenshot de un nodo de Figma.
    Úsalo cuando necesites una imagen de referencia visual del componente.
  `,
  inputSchema: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'ID del nodo de Figma en formato "123:456" (sin guiones).'
      },
      format: {
        type: 'string',
        enum: ['png', 'jpeg'],
        description: 'Formato de la imagen.',
        default: 'png'
      },
      scale: {
        type: 'number',
        description: 'Factor de escala del screenshot.',
        default: 2
      }
    },
    required: ['nodeId']
  }
};
