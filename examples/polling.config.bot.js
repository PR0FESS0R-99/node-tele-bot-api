const { NodeTeleBotAPI } = require("node-tele-bot-api");

const BOT_TOKEN = '<bot-token>';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

// Start Command
bot.onCommand("start", function (message) {
    const chat_id = message.chat.id;
    const text = `Polling Config Bot...`;

    bot.telegram.sendMessage({ chat_id, text });
});

// Start Bot
bot.startBot(() => {
    console.log("Bot Started....!");
});

// Polling Configuration
bot.setPollingConfig({
    limit: 100,
    timeout: 1,
    retryDelay: 10
});