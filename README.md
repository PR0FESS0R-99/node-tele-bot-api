# node-tele-bot-api

A lightweight Node.js library for building powerful and scalable Telegram bots. Easily manage messages, commands, and events with a simple and intuitive API.

## Features

- Simple API for creating and managing Telegram bots
- Support for handling commands and events
- Flexible and scalable architecture
- Easy to integrate with existing Node.js applications

## Installation

```bash
npm install node-tele-bot-api
```

## Usage

Here’s a quick example of how to get started:

```
const EasyTelegramBotAPI = require('node-tele-bot-api');

const botToken = 'YOUR_BOT_TOKEN';
const bot = new EasyTelegramBotAPI(botToken);

bot.onCommand('/start', (message) => {
    bot.sendMessage({
        chat_id: message.chat.id,
        text: 'Welcome to the bot!'
    });
});

bot.start(() => {
    console.log('Bot is running...');
});
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE]() file for details.