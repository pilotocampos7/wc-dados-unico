# WC DADOS — Bot Telegram Python

Bot base para acompanhar Bac Bo e enviar sinais no Telegram.

## Configuração
Defina as variáveis:
- TELEGRAM_BOT_TOKEN
- CASINOSCORES_URL
- MIN_ROUNDS=10
- MIN_STRENGTH=75
- POLL_SECONDS=10

## Instalação
```bash
pip install -r requirements.txt
python bot.py
```

O token não fica gravado no código.

## Comandos
/start
/status
/historico
/limpar

A captura automática do CasinoScores fica separada para que a estrutura real dos resultados seja validada antes de gerar sinais.
