import os
import logging
from collections import deque
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
MIN_ROUNDS = int(os.getenv("MIN_ROUNDS", "10"))
MIN_STRENGTH = float(os.getenv("MIN_STRENGTH", "75"))

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("wc_dados")

history = deque(maxlen=200)
active_signal = None
green = red = tie = 0

def emoji(r):
    return {"A": "🔵", "R": "🔴", "E": "⚪"}.get(r, "❔")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🤖 WC DADOS ONLINE\n\n"
        f"🎲 Histórico: {len(history)} rodadas\n"
        f"📚 Mínimo: {MIN_ROUNDS} rodadas\n"
        f"💪 Força mínima: {MIN_STRENGTH:.0f}%"
    )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📡 WC DADOS\n"
        f"Rodadas: {len(history)}\n"
        f"🟢 GREEN: {green}\n"
        f"🔴 RED: {red}\n"
        f"⚪ EMPATE SINAL: {tie}\n"
        f"🎯 Sinal ativo: {'SIM' if active_signal else 'NÃO'}"
    )

async def historico(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not history:
        await update.message.reply_text("Histórico vazio.")
        return
    text = " ".join(emoji(x) for x in list(history)[-30:])
    await update.message.reply_text(f"📜 Últimas rodadas:\n{text}")

async def limpar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global active_signal, green, red, tie
    history.clear()
    active_signal = None
    green = red = tie = 0
    await update.message.reply_text("🧹 Histórico e contadores limpos.")

async def on_error(update, context):
    log.exception("Erro no Telegram", exc_info=context.error)

def main():
    if not TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN não configurado.")
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(CommandHandler("historico", historico))
    app.add_handler(CommandHandler("limpar", limpar))
    app.add_error_handler(on_error)
    log.info("WC DADOS Telegram iniciado.")
    app.run_polling()

if __name__ == "__main__":
    main()
