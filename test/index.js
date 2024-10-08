const { NodeTeleBotAPI } = require("node-tele-bot-api");
const { Markup } = require("node-tele-bot-api/types");

const BOT_TOKEN = '7070608927:AAEoSW0AkO2Icoc2Xwg7mfxSSkybuJdvwFc';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

// its just demo of https webhook
// bot.setWebhookConfig({
//     domain: "", // url
// });

bot.onCommand("start", function (message) {
    bot.telegram.sendMessage({
        chat_id: message.chat.id,
        text: `Hello! I'm a simple bot that responds to /start command with a greeting message.`,
        reply_markup: Markup.createButton([[
            Markup.button({ text: "Click me!", callback_data: "click_me" }),
        ]]),
    });
});

bot.onCallbackQuery('click_me', function (query) {
    bot.telegram.answerCallbackQuery({
        callback_query_id: query.id,
        text: "You've clicked the button!",
        show_alert: true,
    });
});

bot.start(() => {
    console.log("Bot Started");
});