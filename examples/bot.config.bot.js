const { NodeTeleBotAPI } = require("node-tele-bot-api");

const BOT_TOKEN = '<bot-token>';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

// Start Command
bot.onCommand("start", function (message) {
    const chat_id = message.chat.id;
    const text = `Bot Config Bot...`;

    bot.telegram.sendMessage({ chat_id, text });
});

// Start Bot
bot.startBot(() => {
    console.log("Bot Started....!");
});

// Bot Configuration
bot.setBotConfig({
    // allowedUpdates,
    // token,
    // baseApiUrl,
    // isTestMode
});