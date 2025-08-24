import { httpGet } from "../utils/http";

export async function listarPizzas() {
    const pizzas = await httpGet('/pizzas');
    return pizzas;
}