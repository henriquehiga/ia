import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { enviarPedido } from "./functions/enviar-pedido.function";
import { listarPizzas } from "./functions/listar-pizzas.function";

const server = new McpServer({
  name: "mcp-server-atendente-simples",
  version: "1.0.0"
});

server.registerTool("listar_pizzas_tool",
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

server.registerTool("enviar_pedido_tool",
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

const transport = new StdioServerTransport();
server.connect(transport);