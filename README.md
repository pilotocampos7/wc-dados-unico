# WC DADOS AUTO

Robô automático do WC DADOS para captura do histórico do CasinoScores Bac Bo.

## Regras atuais
- mínimo de 10 rodadas antes do primeiro sinal;
- força mínima 75%;
- sem espera de 4 rodadas após sinal;
- sem repetições simples;
- sem assinaturas curtas;
- sem quebra de sequência;
- empate não é alvo;
- empate durante sinal conta como GREEN;
- sinal encerra na rodada seguinte e a análise é refeita imediatamente;
- mostra Pxxx, nome e força.

## Publicação
Este pacote é um **Cloudflare Worker com Assets + Browser Run**, não um Direct Upload de Pages. O binding BROWSER precisa estar disponível na conta Cloudflare. Publique com Wrangler (`npx wrangler deploy`) ou conecte o repositório ao fluxo de deploy do Worker.

A captura depende do conteúdo renderizado do CasinoScores e pode precisar de ajuste no parser caso o site altere sua estrutura.
