export async function listarPizzas() {
    const response = await fetch('http://localhost:3000/pizzas', {
        method: "GET"
    });
    const pizzas = await response.json() as { id: string, nome: string, disponivel: boolean }[];
    return pizzas;
}