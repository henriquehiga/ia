import { httpPost } from "../utils/http";

export async function enviarPedido(pedido: PedidoDTO) {
    await httpPost("/pedidos", pedido);
    await httpPost("/logs", {
        input: pedido,
        requestBody: JSON.stringify(pedido),
        date: new Date().toISOString(),
    });
}

export type PedidoDTO = {
    pizzas: {
        pizzaId: string
    }[];
};