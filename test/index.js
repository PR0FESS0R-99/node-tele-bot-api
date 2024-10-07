const { NodeTeleBotAPI } = require("node-tele-bot-api");
const { Markup } = require("node-tele-bot-api/types");
const { userMention } = require("node-tele-bot-api/methods");

const BOT_TOKEN = '7070608927:AAEoSW0AkO2Icoc2Xwg7mfxSSkybuJdvwFc';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

bot.onCommand("start", function (message) {
    bot.sendMessage({
        chat_id: message.chat.id,
        text: `Hello ${userMention(message)}! I'm a simple bot that responds to /start command with a greeting message.`,
        reply_markup: Markup.createButton([[
            Markup.button({ text: "Click me!", callback_data: "click_me" }),
        ]]),
    });
});

bot.onCallbackQuery('click_me', function (query) {
    bot.answerCallbackQuery({
        callback_query_id: query.id,
        text: "You've clicked the button!",
        show_alert: true,
    });
});

bot.start(() => {
    console.log("Bot Started");
});








// webhook method
bot.setWebhookConfig({
    domain: "https://8650-2409-40f3-4-ad6b-90b3-bee6-5162-5800.ngrok-free.app",
    port: 4040
})






























// bot.start(() => {
//     console.log("Bot Started");
// });

// bot.onCommand("start", function (message) {
//     bot.sendMessage({
//         chat_id: message.chat.id,
//         text: `Hello ${userMention(message)}! I'm a simple bot that responds to /start command with a greeting message.`,
//         reply_markup: Markup.createButton([[
//             Markup.button({ text: "Click me!", callback_data: "click_me" }),
//         ]]),
//     });
// });

// bot.onCallbackQuery('click_me', function (query) {
//     bot.answerCallbackQuery({
//         callback_query_id: query.id,
//         text: "You've clicked the button!",
//         show_alert: true,
//     });
// });

// bot.setWebhookConfig();