const ParseMode = require("../types/parseMode");

const userMention = (message, options) => {

    options = {
        press_mode: ParseMode.HTML,
        ...options
    }

    if (message.message) {
        message = message.message;
    };

    const user_id = options.name || message.from.id;
    const first_name = message.from.first_name;
    const link = `tg://user?id=${user_id}`;

    if (options.press_mode === ParseMode.HTML) {
        return `<a href="${link}">${first_name}</a>`
    } else {
        return `[${first_name}](${link})`
    };
};

module.exports = userMention;