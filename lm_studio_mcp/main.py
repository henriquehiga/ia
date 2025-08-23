import datetime
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("teste")


@mcp.tool(
    name="dobrar_numero_function",
    description="Tool para dobrar um número recebido. A função recebe apenas o número.",
)
def dobrar_numero(numero: int) -> int:
    return numero * 2


@mcp.tool(
    name="data_atual_function",
    description="Essa função retorna o valor correto da data atual. Não recebe nenhum parâmetro, retorna o tipo datetime do python."
)
def resgatar_data_atual() -> str:
    return datetime.date.today().isoformat()


if __name__ == "__main__":
    mcp.run(transport='stdio')
