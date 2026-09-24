import aiohttp

SOURCE = "https://www.casino.org/casinoscores/pt-br/bac-bo/"

class CasinoScoresAdapter:
    def __init__(self, url=SOURCE):
        self.url = url

    async def fetch_html(self):
        timeout = aiohttp.ClientTimeout(total=20)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(
                self.url,
                headers={"User-Agent": "Mozilla/5.0"}
            ) as response:
                response.raise_for_status()
                return await response.text()

    async def fetch_results(self):
        # Não interpreta simplesmente palavras AZUL/VERMELHO.
        # O seletor real dos resultados deve ser confirmado antes
        # de ativar a captura automática em produção.
        await self.fetch_html()
        return []
