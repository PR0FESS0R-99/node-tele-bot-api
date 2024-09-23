const EventEmitter = require('events').EventEmitter;
const messageTypes = require('./types/messageTypes');

class TelegramBotAPI extends EventEmitter {
    constructor(botToken, options = {}) {
        super();

        this.botToken = botToken;
        this.offset = 0;
        this.started = false;

        this.options = {
            baseApiUrl: options.baseApiUrl || 'https://api.telegram.org',
            timeout: options.timeout || 500,
            limit: options.limit || 100,
            testEnvironment: options.testEnvironment || false
        };
    };

    #buildURL(path) {
        const envPath = this.options.testEnvironment ? '/test' : '';
        return `${this.options.baseApiUrl}/bot${this.botToken}${envPath}/${path}`;
    };

    start(callback) {
        this.started = true;
        this.#handleLoop();
        callback && callback();
    };

    stop(callback) {
        this.started = false;
        callback && callback();
    };

    // === === === === //

    onCommand(command, callback) {
        this.on(command.toLowerCase(), (update) => {
            callback(update.message);
        });
    };

    onMessage(messageType, callback) {
        if (!Object.values(messageTypes).includes(messageType)) {
            throw new Error(`Unsupported message type: ${messageType}`);
        };

        this.on(messageType, (update) => {
            callback(update.message);
        });
    };

    onText(text, callback) {
        this.on('handleOnText', (update) => {
            const reqTxT = update.message?.text || "";

            if (typeof text === 'string' && reqTxT.startsWith(text)) {
                callback(update.message);
            } else if (text instanceof RegExp && text.test(reqTxT)) {
                callback(update.message);
            };
        });
    };

    // query is optioal callback is requeys
    onCallbackQuery(query, callback) {
        if (typeof query === 'function') {
            callback = query;
            query = "all_______";
        };

        if (query && /^\/.*\/$/.test(query)) {
            query = query + "_callback_regex";
        } else {
            query = query + "_callback_query";
        };

        this.on(query, (update) => {
            callback && callback(update.callback_query);
        });
    };

    // === === === === //

    sendMessage(options) {
        return this.#request("sendMessage", options);
    };

    sendPhoto(options) {
        return this.#request('sendPhoto', options);
    };

    sendDocument(options) {
        return this.#request('sendDocument', options);
    };

    sendAudio(options) {
        return this.#request('sendAudio', options);
    };

    sendSticker(options) {
        return this.#request('sendSticker', options);
    };

    sendVideo(options) {
        return this.#request('sendVideo', options);
    };

    sendVoice(options) {
        return this.#request('sendVoice', options);
    };

    editMessageText(options) {
        return this.#request('editMessageText', options);
    };

    editMessageCaption(options) {
        return this.#request('editMessageCaption', options);
    };

    deleteMessage(options) {
        return this.#request('deleteMessage', options);
    };

    deleteMessages(options) {
        return this.#request('deleteMessages', options);
    };

    getFile({ file_id }) {
        return this.#request("getFile", { file_id });
    };

    getFileLink({ file_id }) {
        return this.getFile({ file_id }).then(function (response) {
            return `${this.options.baseApiUrl}/file/bot${this.botToken}/${response.file_path}`
        }.bind(this)).catch(error => {
            return { error: error.message }
        });
    };

    // === === === === //

    #preparePayload(options) {
        if (!options) {
            return { method: 'GET' };
        }

        const formData = new FormData();
        Object.entries(options).forEach(([key, value]) => {
            if (typeof value === 'object' && value?.source) {
                if (Buffer.isBuffer(value.source)) {
                    formData.append(key, value.source, { knownLength: value.source.length });
                } else if (fs.existsSync(value.source)) {
                    formData.append(key, fs.createReadStream(value.source), { knownLength: fs.statSync(value.source).size });
                }
            } else {
                formData.append(key, value);
            };
        });

        return { method: 'POST', body: formData };
    };

    #request(path, options) {
        if (!this.botToken) {
            throw new Error('Telegram Bot Token is required');
        };

        const payload = this.#preparePayload(options);
        const url = this.#buildURL(path);

        return fetch(url, payload).then(res => res.json()).then(function (response) {
            if (!response.ok) {
                throw new Error(`Error Code : ${response.error_code} : ${response.description}`);
            };
            return response.result;
        });
    };

    #getUpdates({ offset, timeout, limit }) {
        const path = `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`
        return this.#request(path);
    };

    #handleUpdate(update) {
        let offset = update.update_id + 1;

        // OnText Message Handler
        if (update?.message) {
            this.emit("handleOnText", update);
        }

        // onMessage Message Handler
        if (update?.message) {
            Object.entries(messageTypes).forEach(([key, value]) => {
                if (update.message[value] && this.eventNames().includes(value)) {
                    this.emit(value, update);
                }
            });
        }

        // onCommand Message Handler
        if (update?.message?.entities) {
            const commandEntity = update.message.entities.find(entity => entity.type === 'bot_command');
            if (commandEntity) {
                const command = update.message.text
                    .substring(commandEntity.offset, commandEntity.offset + commandEntity.length)
                    .replace('/', '')
                    .toLowerCase();
                this.emit(command, update);
            }
        }

        // onCallbackQuery Handler
        if (update?.callback_query) {
            const callbackData = update.callback_query.data;

            // Filter events for query and regex callbacks
            const filteredQueryArray = this.#filterCallbackEvents('_callback_query');
            const filteredRegexArray = this.#filterCallbackEvents('_callback_regex', true);

            // Handle exact match callbacks
            if (filteredQueryArray.includes(callbackData)) {
                this.emit(callbackData + '_callback_query', update);
            }
            // Handle regex-based callbacks
            else if (this.#matchRegexCallback(filteredRegexArray, callbackData)) {
                const matchingEvent = this.#matchRegexCallback(filteredRegexArray, callbackData);
                this.emit(matchingEvent + '_callback_regex', update);
            }
            // Emit default callback for unmatched cases
            else {
                this.emit('all________callback_query', update);
            }
        }

        this.offset = offset;
    }

    #filterCallbackEvents(suffix, isRegex = false) {
        return this.eventNames()
            .filter(item => item.endsWith(suffix))
            .map(item => (isRegex ? item.replace(/_callback_regex$/, '') : item.replace(/_callback_query$/, '')));
    };

    #matchRegexCallback(regexArray, data) {
        return regexArray.find(pattern => {
            const regex = new RegExp(pattern.slice(1, -1));
            return regex.test(data);
        });
    };

    #handleLoop() {
        if (!this.started) {
            return;
        };

        const updateLoop = this.#handleLoop.bind(this);
        const handleUpdate = this.#handleUpdate.bind(this);

        this.#getUpdates({
            offset: this.offset,
            limit: this.options.limits,
            timeout: this.options.timeout
        }).then(function (updates) {
            updates.forEach(update => handleUpdate(update));
            updateLoop();
        }).catch(function (error) {
            console.log(error);
            updateLoop();
        });
    };
};

module.exports = TelegramBotAPI