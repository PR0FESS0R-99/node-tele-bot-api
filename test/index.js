const TelegramBotAPI = require("node-tele-bot-api");
const MessageTypes = require('node-tele-bot-api/types/messageTypes');
const PressModes = require('node-tele-bot-api/types/pressModes');
const Markup = require('node-tele-bot-api/types/markup');

const BOT_TOKEN = '7070608927:AAEoSW0AkO2Icoc2Xwg7mfxSSkybuJdvwFc';

const bot = new TelegramBotAPI(BOT_TOKEN);

// Normal Command
bot.onCommand("start", function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "*Welcome...*",
        press_mode: PressModes.MarkdownV2
    });
});

// button
bot.onCommand("button", function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "button...",
        reply_markup: Markup.createButton([[
            Markup.button({ name: "Query", callback_data: 'query_data' }),
            Markup.button({ name: "Regex", callback_data: 'query_regex#12' }),
            Markup.button({ name: "All", callback_data: 'all' }),
        ]])
    });
});

// keyboard
bot.onCommand("keyboard", function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "keyboard...",
        reply_markup: Markup.createKeyboard({
            keyboard: [
                Markup.keyboaed("Btn", "Close")
            ],
            one_time_keyboard: false,
            resize_keyboard: true
        })
    });
});

// Reponse Hello Text
bot.onText("hello", function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "Hello..."
    });
})

bot.onText("hi", function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "hi..."
    });
})

bot.onText("hey", function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "hey..."
    });
})

// Regex (/help or !help) 
bot.onText(/^[!\/]help(?:\s|$)/i, function (update) {
    bot.sendMessage({
        chat_id: update.chat.id,
        text: "Help Command..."
    });
});

// photo
bot.onMessage(MessageTypes.PHOTO, function (update) {
    bot.sendPhoto({
        chat_id: update.chat.id,
        photo: update.photo.pop().file_id
    })
})

// callback all
bot.onCallbackQuery((update) => {
    bot.sendMessage({
        chat_id: update.message.chat.id,
        text: "All Callback"
    })
})

// query callback
bot.onCallbackQuery('query_data', (update) => {
    bot.editMessageText({
        chat_id: update.message.chat.id,
        text: "Query Callback"
    })
});

// regex callback
bot.onCallbackQuery(/query_regex/, (update) => {
    bot.editMessageText({
        chat_id: update.message.chat.id,
        text: "Query Callback",
        message_id: update.message.message_id
    })
});


// Run The Bot
bot.start(() => {
    console.log("Bot Started");
});