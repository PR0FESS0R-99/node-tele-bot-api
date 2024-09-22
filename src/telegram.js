const EventEmitter = require('events').EventEmitter;
const messageTypes = require('./types/messageTypes');

class TelegramBotAPI extends EventEmitter {
    constructor(botToken, options = {}) {
        super();

        this.botToken = botToken;
        this.offset = 0;
        this.options = options;
        this.options.baseApiUrl = options?.baseApiUrl ?? 'https://api.telegram.org';
        this.options.timeout = options?.timeout ?? 500;
        this.options.limit = options?.limit ?? 100;
        this.started = false;
    };

    #buildURL(_path) {
        return `${this.options.baseApiUrl}/bot${this.botToken}${this.options.testEnvironment ? '/test' : ''}/${_path}`;
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
        this.on(messageType, (update) => {
            callback(update.message)
        });
    };

    onCallback(callback) {
        this.on('callback_query', (update) => {
            callback(update.callback_query)
        });
    };

    onCallbackQuery(query, callback) {
        this.on(`${query}_callback_query`, (update) => {
            callback(update.callback_query)
        });
    };

    // === === === === //

    sendMessage(options) {
        return this.#request({
            path: "sendMessage",
            options
        });
    };

    sendPhoto(options) {
        return this.#request({
            path: 'sendPhoto',
            options
        });
    };

    sendDocument(options) {
        return this.#request({
            path: 'sendDocument',
            options
        });
    };

    sendAudio(options) {
        return this.#request({
            path: 'sendAudio',
            options
        });
    };

    sendSticker(options) {
        return this.#request({
            path: 'sendSticker',
            options
        });
    };

    sendVideo(options) {
        return this.#request({
            path: 'sendVideo',
            options
        });
    };

    sendVoice(options) {
        return this.#request({
            path: 'sendVoice',
            options
        });
    };

    editMessageText(options) {
        return this.#request({
            path: 'editMessageText',
            options
        });
    };

    editMessageCaption(options) {
        return this.#request({
            path: 'editMessageCaption',
            options
        });
    };

    deleteMessage(options) {
        return this.#request({
            path: 'deleteMessage',
            options
        });
    };

    deleteMessages(options) {
        return this.#request({
            path: 'deleteMessages',
            options
        });
    };

    getFile({ file_id }) {
        return this.#request({
            path: "getFile",
            options: { file_id }
        });
    };

    getFileLink({ file_id }) {
        return this.getFile({ file_id }).then(function (response) {
            return `${this.options.baseApiUrl}/file/bot${this.botToken}/${response.file_path}`
        }.bind(this)).catch(error => {
            return { error: error.message }
        })
    };

    // === === === === //

    #request({ path, options }) {
        if (!this.botToken) {
            throw new Error('Telegram Bot Token is required');
        };

        let payload;
        if (options) {
            options = options || {};

            let formData = new FormData();
            Object.entries(options).forEach(function ([key, value]) {
                if (typeof value === 'object') {
                    const data = value.source;
                    if (data) {
                        if (Buffer.isBuffer(data)) {
                            formData.append(key, data, {
                                knownLength: data.length
                            });
                        } else if (fs.existsSync(data)) {
                            formData.append(key, fs.createReadStream(data), {
                                knownLength: fs.statSync(data).size
                            });
                        } else {
                            formData.append(key, data)
                        }
                    } else {
                        formData.append(key, value);
                    };
                } else {
                    formData.append(key, value);
                }
            });
            payload = { method: "POST", body: formData };
        } else {
            payload = { method: "GET" };
        };

        return fetch(this.#buildURL(path), payload).then(res => res.json()).then(function (response) {
            if (!response.ok) {
                console.log('-----');
                console.log(`Error Code : ${response.error_code} : ${response.description}`);
                console.log('-----');
                throw new Error(`Error Code : ${response.error_code} : ${response.description}`);
            };
            return response.result;
        });
    };

    #getUpdates({ offset, timeout, limit }) {
        return this.#request({
            path: `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`
        });
    };

    #handleUpdate(update) {
        let offset = update.update_id + 1;

        if (update?.message?.entities && update.message.entities.length > 0) {

            const entities = update.message.entities[update.message.entities.length - 1];

            // Check if the entity type is 'bot_command'
            if (entities.type === 'bot_command') {
                const command = update.message.text.split(' ')[0].replace('/', '');
                this.emit(command, update);
            }
        } else if (update?.callback_query) {
            const list = this.eventNames();
            if (list.find(event => event === update.callback_query.data + '_callback_query')) {
                this.emit(`${update.callback_query.data}_callback_query`, update);
            } else {
                this.emit('callback_query', update);
            };
        } else {
            Object.values(messageTypes).forEach(type => {
                if (update.message?.[type]) {
                    const list = this.eventNames();
                    if (list.find(event => event === type)) {
                        this.emit(type, update);
                    };
                };
            });
        };

        this.offset = offset;
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