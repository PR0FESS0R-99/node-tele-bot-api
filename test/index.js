const TelegramBotAPI = require("node-tele-bot-api");
const messageTypes = require("node-tele-bot-api").messageTypes;

const BOT_TOKEN = '7070608927:AAEoSW0AkO2Icoc2Xwg7mfxSSkybuJdvwFc';

const bot = new TelegramBotAPI(BOT_TOKEN);

// Start the Bot
bot.start(() => {
    console.log("Bot Started....");
});

// Basic Bot Command
bot.onCommand("start", (update) => {
    const chat_id = update.chat.id;
    bot.sendMessage({
        chat_id,
        text: "Welcome To Node Tele Bot API"
    });
});

// echo
bot.onMessage(messageTypes.TEXT, (update) => {
    const chat_id = update.chat.id;
    bot.sendMessage({
        chat_id,
        text: update.text
    });
});