const { NodeTeleBotAPI } = require("node-tele-bot-api");
const { Markup } = require("node-tele-bot-api/types");

const BOT_TOKEN = '<bot-token>';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

// Echo Message
bot.onMessage('text', (message) => {

    const chat_id = message.chat.id;
    const text = 'Echo Bot  :  ' + message.text;

    const reply_markup = Markup.createButton([[
        Markup.button({ text: "JOIN", url: "https://t.me/nodetelebotapi" }),
        Markup.button({ text: "DELETE", callback_data: "delete" }),
    ]]);

    bot.telegram.sendMessage({ chat_id, text, reply_markup });
});

// CallbackQuery
bot.onCallbackQuery('delete', function (query) {
    bot.telegram.deleteMessage({
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
    });
});

// Start the Bot
bot.startBot(() => {
    console.log("Bot Started....!");
});