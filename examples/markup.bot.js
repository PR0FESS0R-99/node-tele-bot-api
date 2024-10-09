const { NodeTeleBotAPI } = require("node-tele-bot-api");
const { Markup } = require("node-tele-bot-api/types");

const BOT_TOKEN = '<bot-token>';

const bot = new NodeTeleBotAPI(BOT_TOKEN);

// Command
bot.onCommand("start", function (message) {
    const chat_id = message.chat.id;
    const text = `Markup Bot...`;


    const reply_markup = Markup.createButton([[
        Markup.button({ text: "JOIN", url: "https://t.me/nodetelebotapi" }),
        Markup.button({ text: "CALLBACK", callback_data: "sampleCallback" }),
    ]]);

    bot.telegram.sendMessage({ chat_id, text, reply_markup });
});

// CallbackQuery
bot.onCallbackQuery('sampleCallback', function (query) {
    bot.telegram.editMessageText({
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        text: "Message Edited.....",
    });
});

// Keyboard Command
bot.onCommand("keyboard", function (message) {
    const chat_id = message.chat.id;
    const text = `sample keyboard`;

    const reply_markup = Markup.createKeyboard({
        keyboard: [
            Markup.keyboaed("Keyboard1", "Keyboard2", "Keyboard3")
        ],
        resize_keyboard: true,
        // one_time_keyboard: true, 
    });

    bot.telegram.sendMessage({ chat_id, text, reply_markup });
});

// Handle Keyboard Text
bot.onMessage('text', (message) => {
    if (message.text === 'Keyboard1') {
        const chat_id = message.chat.id;
        const text = message.text;
        bot.telegram.sendMessage({ chat_id, text });
    };

    if (message.text === 'Keyboard2') {
        const chat_id = message.chat.id;
        const text = message.text;
        bot.telegram.sendMessage({ chat_id, text });
    };

    if (message.text === 'Keyboard3') {
        const chat_id = message.chat.id;
        const text = message.text;
        bot.telegram.sendMessage({ chat_id, text });
    };
})

// Start the Bot
bot.startBot(() => {
    console.log("Bot Started....!");
});