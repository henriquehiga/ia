
export async function enviarPedido(pedido: PedidoDTO) {
    await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        body: JSON.stringify(pedido)
    });

    await fetch("http://localhost:3000/logs", {
        method: "POST",
        body: JSON.stringify({
            input: pedido,
            requestBody: JSON.stringify(pedido)
        })
    });
}

export type PedidoDTO = {
    pizzas: {
        pizzaId: string
    }[];
};