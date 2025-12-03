import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { promises as fs } from 'fs';
import path from 'path';

export class FigmaMcpClient {
  private client: Client;

  constructor(
    private nodeId: string
  ) {
    this.client = new Client(
      { name: 'd2c-client', version: '0.1.0' },
      {
        capabilities: {

        }
      }
    );
  }

  async connect() {
    const transport = new StreamableHTTPClientTransport(
      new URL('http://127.0.0.1:3845/mcp')
    );

    const originalOnMessage = transport.onmessage;

    transport.onmessage = (msg: any) => {
      if (msg?.result?.serverInfo?.icons) {
        for (const icon of msg.result.serverInfo.icons) {
          if (typeof icon.sizes === "string") {
            icon.sizes = [icon.sizes];  // fix bug
          }
        }
      }

      if (originalOnMessage) originalOnMessage(msg);
    };

    await this.client.connect(transport);
  }

  async getFigmaContextWithCodeConnect() {
    const nodeId = this.nodeId.replace('-', ':')// '2730:271553'
    const designContext = await this.client.callTool({
      name: 'get_design_context',
      arguments: {
        nodeId,
        clientLanguages: 'typescript',
        clientFrameworks: 'react',
      }
    });
    const codeConnectMap = await this.client.callTool({
      name: 'get_code_connect_map',
      arguments: {
        nodeId,
        clientLanguages: 'typescript',
        clientFrameworks: 'react',
      }
    });
    const screenshot = await this.client.callTool({
      name: 'get_screenshot',
      arguments: {
        nodeId,
        format: 'png',
        scale: 2,
      }
    });

    await this.client.close();

    this.writeFileWithDirs('/Users/alvaro/Downloads/alvaro.ts', JSON.stringify({
      designContext,
      codeConnectMap,
      screenshot,
    }));

    return {
      designContext,
      codeConnectMap,
      screenshot,
    };
  }

  async writeFileWithDirs(filePath: any, content: any) {
    const dir = path.dirname(filePath);

    // Crea el directorio (y subdirectorios) si no existen
    await fs.mkdir(dir, { recursive: true });

    // Escribe el archivo
    await fs.writeFile(filePath, content, 'utf8');
  }
}
