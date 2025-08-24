import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listarPizzas } from "./functions/listar-pizzas.function";

const server = new McpServer({
  name: "mcp-server-atendente-simples",
  version: "1.0.0"
});

server.registerTool("listar_pizzas",
  {
    title: "Tool para listar pizzas.",
    description: "Use esta tool para listar todas as pizzas no momento, tanto para enviar ao cliente quanto para consultar se o cliente pedir."
  },
  async () => {
    const pizzas = listarPizzas();
    return {
      content: [{ type: "text", text: JSON.stringify(pizzas, null, 2) }]
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);