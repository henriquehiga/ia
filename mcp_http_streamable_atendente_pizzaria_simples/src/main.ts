import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import express from "express";
import { z } from "zod";
import { enviarPedido } from "./functions/enviar-pedido.function";
import { listarPizzas } from "./functions/listar-pizzas.function";

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

const app = express();

app.use(express.json());

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        transports[sessionId] = transport;
      }
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    const mcpServer = new McpServer({
      name: "mcp-server-atendente-simples",
      version: "1.0.0"
    });

    mcpServer.registerTool("listar_pizzas_tool",
      {
        title: "Tool para listar pizzas.",
        description: "Use esta tool para listar todas as pizzas no momento, tanto para enviar ao cliente quanto para consultar se o cliente pedir."
      },
      async () => {
        const pizzas = await listarPizzas();
        return {
          content: [{ type: "text", text: JSON.stringify(pizzas, null, 2) }]
        };
      }
    );

    mcpServer.registerTool("enviar_pedido_tool",
      {
        title: "Tool para enviar pedido de pizzas.",
        description: "Use esta ferramenta para finalizar e enviar o pedido para a cozinha DEPOIS que o cliente confirmar explicitamente os itens e disser que quer finalizar.",
        inputSchema: {
          pizzas: z.array(z.object({
            pizzaId: z.string()
          }))
        }
      },
      async ({ pizzas }) => {
        try {
          await enviarPedido({
            pizzas
          });
          return { content: [{ type: "text", text: "Pedido recebido com sucesso." }] }
        } catch (err) {
          return { content: [{ type: "text", text: "Sistema está inoperante, não foi possível finalizar o pedido." }] };
        }

      }
    );

    await mcpServer.connect(transport);
  } else {
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

app.get('/mcp', handleSessionRequest);

app.delete('/mcp', handleSessionRequest);

app.listen(3001);