// Create Buttons
module.exports.createButton = (button) => {
    return JSON.stringify({
        inline_keyboard: button
    });
};

module.exports.button = ({ text, url, callback_data }) => {
    if (callback_data) {
        return {
            text, callback_data
        }
    } else if (url) {
        return {
            text, url
        };
    };
};

// Create Keyboards
module.exports.createKeyboard = ({ keyboard, resize_keyboard = false, one_time_keyboard = false }) => {
    return JSON.stringify({
        keyboard,
        resize_keyboard,
        one_time_keyboard
    });
};

module.exports.keyboaed = (...keyboards) => {
    keyboards = keyboards.map(keyboard => `${keyboard}`);
    return keyboards;
};