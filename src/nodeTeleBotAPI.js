const APIClient = require("./telegram/core/apiClient");
const TelegramMethod = require("./telegram/telegram");
const TelegramPolling = require("./telegram/core/polling");
const TelegramWebhook = require("./telegram/core/webhook");
const EventEmitter = require('events');
const MessageTypes = require("./utils/messageTypes");

class NodeTeleBotAPI {
    constructor(botToken) {
        if (!this?.botConfig?.token && (typeof botToken !== 'string' || !botToken.trim())) {
            throw new Error("Bot token must be a non-empty string.");
        };

        this.botStarted = false;

        this.botConfig = {
            token: botToken || this?.botConfig?.token,
            baseApiUrl: "https://api.telegram.org",
            allowedUpdates: [],
            isTestMode: false
        };

        // Polling Params 
        this.polling = {
            timeout: 1,
            limit: 100,
            retryDelay: 2000 // Default retry delay in milliseconds
        };

        // Initialize APIClient with botConfig
        this.callApi = new APIClient(this.botConfig);

        // Initialize TelegramMethod with APIClient instance
        this.telegram = new TelegramMethod(this.callApi);

        // Event Emitters for command, message, and callback queries
        this.commandEvent = new EventEmitter();
        this.messageTypeEvent = new EventEmitter();
        this.callbackEvent = new EventEmitter();

        // Webhook Params
        this.webhook = {
            start: false,
            domain: null,
            hostname: null,
            path: null,
            port: null,
            callback: null
        };
    };

    // ============================================== //

    /**
     * Updates the bot configuration.
     * @param {Object} config - The configuration object.
     * @param {string} config.token - The bot token.
     * @param {string} [config.baseApiUrl] - The base API URL for the bot.
     * @param {Array<string>} [config.allowedUpdates] - Array of allowed updates.
     * @param {boolean} [config.isTestMode] - Flag indicating if the bot is in test mode.
     */
    setBotConfig({ token, baseApiUrl, allowedUpdates, isTestMode }) {
        if (!this?.botConfig?.token && (typeof token !== 'string' || !token.trim())) {
            throw new Error("token must be a non-empty string.");
        }

        if (baseApiUrl && typeof baseApiUrl !== 'string') {
            throw new Error("baseApiUrl must be a string.");
        }

        if (allowedUpdates && !Array.isArray(allowedUpdates)) {
            throw new Error("allowedUpdates must be an array.");
        }

        if (isTestMode !== undefined && typeof isTestMode !== 'boolean') {
            throw new Error("isTestMode must be a boolean.");
        }

        // Update bot configuration with provided values or retain existing ones
        this.botConfig.token = token || this.botConfig.token;
        this.botConfig.baseApiUrl = baseApiUrl || this.botConfig.baseApiUrl;
        this.botConfig.allowedUpdates = allowedUpdates || this.botConfig.allowedUpdates;
        this.botConfig.isTestMode = isTestMode !== undefined ? isTestMode : this.botConfig.isTestMode;

        console.log("Bot configuration successfully updated:", this.botConfig);
    };

    /**
     * Sets the polling configuration.
     * @param {Object} config - The polling configuration object.
     * @param {number} config.timeout - The timeout for polling.
     * @param {number} config.limit - The limit of updates to retrieve.
     * @param {number} [config.retryDelay] - The delay to retry polling in case of errors.
     */
    setPollingConfig({ timeout, limit, retryDelay }) {
        if (typeof timeout !== 'number' || typeof limit !== 'number') {
            throw new Error("Both timeout and limit must be numbers.");
        }

        if (retryDelay !== undefined && typeof retryDelay !== 'number') {
            throw new Error("retryDelay must be a number.");
        }

        this.polling.timeout = timeout;
        this.polling.limit = limit;
        this.polling.retryDelay = retryDelay || this.polling.retryDelay; // Default to existing retryDelay if not provided

        console.log("Successfully set polling configuration:", {
            timeout: this.polling.timeout,
            limit: this.polling.limit,
            retryDelay: this.polling.retryDelay,
        });
    };

    /**
     * Sets the webhook configuration.
     * @param {object} config - The webhook configuration object.
     * @param {string} config.domain - The domain for the webhook.
     * @param {string} config.hostname - The hostname for the webhook.
     * @param {string} config.path - The path for the webhook.
     * @param {number} config.port - The port for the webhook.
     * @param {function} config.callback - The callback for webhook requests.
     */
    setWebhookConfig({ domain, hostname, path, port, callback }) {
        if (typeof domain !== 'string') {
            throw new Error("Domain must be strings.");
        };

        if (path && typeof path !== 'string') {
            throw new Error("Path must be a string.");
        };

        if (port && typeof port !== 'number') {
            throw new Error("Port must be a number.");
        };

        if (callback && typeof callback !== 'function') {
            throw new Error("Callback must be a function.");
        };

        if (typeof domain !== 'string') {
            throw new Error("Domain must be strings.");
        }

        this.webhook.start = true;
        this.webhook.domain = domain;
        this.webhook.hostname = hostname;
        this.webhook.path = path;
        this.webhook.port = port;
        this.webhook.callback = callback;

        console.log("Successfully set webhook configuration:", this.webhook);
    };

    // ============================================== //

    /**
     * Connects the bot to a webhook.
     * @param {object} options - The configuration options for the webhook.
     * @param {string} options.url - The URL for the webhook.
     * @param {object} [options.arg] - Additional optional arguments to pass to the setWebhook method.
     * @returns {Promise} - Resolves with the result of setting the webhook or rejects with an error.
     */
    connectWebhook({ url, ...arg }) {
        if (typeof url !== 'string' || !url.trim()) {
            throw new Error('Webhook URL must be a non-empty string.');
        }

        return this.telegram.setWebhook({ url, ...arg })
            .then(response => {
                console.log(`Webhook successfully connected to ${url}`);
                return response;
            })
            .catch(error => {
                console.error(`Failed to connect webhook to ${url}:`, error.message);
                throw new Error('Webhook connection failed. Please check your settings.');
            });
    };

    // ============================================== //

    /**
     * Starts the bot in polling mode.
     * @param {function} [callback] - Optional callback to be executed after starting the bot.
     */
    startBot(callback) {
        if (!this.botConfig?.token) {
            throw new Error("Token must be a non-empty string.");
        };

        this.botStarted = true;

        this.telegram.getMe()
            .then((botInfo) => {
                // Check if webhook is set, otherwise start polling
                if (!this.webhook.start) {
                    return this.telegram.deleteWebhook({ drop_pending_updates: false }).then(() => {
                        // Initialize polling
                        const options = {
                            timeout: this.polling.timeout, // Set timeout from config
                            limit: this.polling.limit, // Set limit from config
                            retryDelay: this.polling.retryDelay, // Set retry delay from config
                        }
                        const polling = new TelegramPolling(this, options);
                        polling.startPolling();
                        callback && callback(botInfo);
                    }).catch(error => {
                        console.error('Error deleting webhook:', error);
                        callback && callback({ error });
                    });
                };

                const webhook = new TelegramWebhook(this, this.webhook);
                webhook.startWebhook(() => {
                    callback && callback(botInfo);
                });
            })
            .catch(error => {
                console.error('Error getting bot info:', error);
                callback && callback({ error });
            });
    };

    // ============================================== //

    /**
     * Registers a command handler.
     * @param {string} command - The command to listen for.
     * @param {function} callback - The callback to execute when the command is received.
     */
    onCommand(command, callback) {
        this.commandEvent.on(command.toLowerCase(), callback);
    };

    /**
     * Registers a message type handler.
     * @param {string} messageType - The type of message to listen for.
     * @param {function} callback - The callback to execute when the message type is received.
     */
    onMessage(messageType, callback) {
        this.messageTypeEvent.on(messageType, callback);
    };

    /**
     * Registers a callback query handler.
     * @param {string} [query] - The query to listen for.
     * @param {function} callback - The callback to execute when the callback query is received.
     */
    onCallbackQuery(query, callback) {
        if (typeof callback !== 'function') {
            callback = query;
            query = 'callback_query';  // Default query
        }
        this.callbackEvent.on(query, callback);
    };

    // ============================================== //

    /**
     * Handles incoming updates from Telegram.
     * @param {Object} update - The update object received from Telegram.
     */
    handleUpdate(update) {
        const message = update.message;
        const callback_query = update.callback_query;

        if (message) {
            const messageType = Object.values(MessageTypes).find((messageType) => {
                return message[messageType];
            });

            // MessageType
            if (messageType && this.messageTypeEvent.eventNames().includes(messageType)) {
                this.messageTypeEvent.emit(messageType, message);
            };

            // Commands
            if (message?.entities) {
                const commandEntity = message?.entities?.find(entity => entity.type === 'bot_command');
                if (commandEntity) {
                    const command = message.text
                        .substring(commandEntity.offset, commandEntity.offset + commandEntity.length)
                        .replace('/', '')
                        .toLowerCase();
                    this.commandEvent.emit(command, message);
                };
            };
        };

        if (callback_query) {
            // Emit events for onCallbackQuery events except without callback
            this.callbackEvent.emit('callback_query', callback_query);

            this.callbackEvent.eventNames().filter(x => x !== 'callback_query').some(eventName => {
                const query = callback_query.data;

                function isRegexPattern(input) {
                    return input.startsWith('/') && input.endsWith('/');
                };

                if (isRegexPattern(eventName)) {
                    // Remove the leading and trailing '/' to create a regex object
                    const regexPattern = eventName.slice(1, -1);  // Extract the pattern part
                    const regex = new RegExp(regexPattern);

                    if (regex.test(query)) {
                        this.callbackEvent.emit(eventName, callback_query);  // Emit event if regex matches query
                    }
                }
                // Emit event if string matches
                else if (eventName === query) {
                    this.callbackEvent.emit(eventName, callback_query);
                };
            });
        };
    };
};

module.exports.NodeTeleBotAPI = NodeTeleBotAPI;