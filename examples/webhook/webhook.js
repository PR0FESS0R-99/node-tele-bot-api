const { NodeTeleBotAPI } = require("node-tele-bot-api");

const BOT_TOKEN = '<bot-token>';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

// Start Command
bot.onCommand("start", function (message) {
    const chat_id = message.chat.id;
    const text = `Webhook Bot...`;

    bot.telegram.sendMessage({ chat_id, text });
});

// Start Bot
bot.startBot(() => {
    console.log("Bot Started....!");
});

// Webhook Setup
bot.setWebhookConfig({
    // domain: URL,
    // hostname: "", optional
    // port: 0, optional
    // path, path, optional
    // callback:  optional
});