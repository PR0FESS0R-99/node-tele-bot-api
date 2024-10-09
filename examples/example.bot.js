const { NodeTeleBotAPI } = require("node-tele-bot-api");

const BOT_TOKEN = '<bot-token>';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

bot.onCommand("start", function (message) {
    const chat_id = message.chat.id;
    const text = `Example Bot...`;

    bot.telegram.sendMessage({ chat_id, text });
});

bot.startBot(() => {
    console.log("Bot Started....!");
});