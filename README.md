<h1 align="center">Node-Tele-Bot-API</h1>

A lightweight Node.js library for building Telegram bots. Easily manage messages, commands, and events with a simple and intuitive API.

## Features

- Simple API for creating and managing Telegram bots
- Support for handling commands and events
- Flexible and scalable architecture
- Easy to integrate with existing Node.js applications
- Supporting Only Common Type (CJS)

## Installation

```sh
npm i node-tele-bot-api
```

## 🚀 Usage

Here’s a quick example of how to get started:

```js
const { NodeTeleBotAPI } = require("node-tele-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const BOT_TOKEN = "YOUR_BOT_TOKEN";

const bot = new NodeTeleBotAPI(BOT_TOKEN);

bot.onCommand("start", function (message) {
  bot.telegram.sendMessage({
    chat_id: message.chat.id,
    text: `Hello! <b>I'm</b> a simple bot that responds to /start command with a greeting message.`,
  });
});

bot.startBot(() => {
  console.log("Bot Started");
});
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

<p align="center">
  <a href="https://github.com/pr0fess0r-99/node-tele-bot-api/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=pr0fess0r-99/node-tele-bot-api" />
  </a>
</p>

## License

**The MIT License (MIT)**

Copyright © 2019 Pr0fess0r-99 (Muhammed RT)

This project is licensed under the MIT License. See the [LICENSE](https://github.com/PR0FESS0R-99/node-tele-bot-api/blob/main/LICENSE) file for details.
