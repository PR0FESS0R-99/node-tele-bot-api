const http = require('http');
const crypto = require('crypto');
const { URL } = require("url");

class TelegramWebhook {
    constructor(bot, options) {
        this.bot = bot;
        this.started = options.started || false;
        this.domain = options.domain;
        this.hostname = options.hostname;
        this.path = options.path || `/node-tele-bot-api/${crypto.randomBytes(32).toString('hex')}`;
        this.port = options.port || 443;
        this.callback = options.callback;
    };

    /**
     * Starts the webhook listener.
     */
    startWebhook(callback) {
        const domain = new URL(this.domain).host;
        this.requestListener(domain, this.port, this.path, this.hostname, this.callback);
        callback();
    };

    /**
     * Sets up the HTTP server to listen for incoming webhook requests.
     * @param {number} port - The port to listen on.
     * @param {string} hookPath - The path for the webhook.
     * @param {string} hostname - The hostname for the server.
     * @param {function} [customCallback] - Optional custom callback for handling requests.
     */
    requestListener(domain, port, hookPath, hostname, customCallback) {
        const webhookCb = this.handleResponse(hookPath, (update) => this.bot.handleUpdate(update));
        const callback = (customCallback && typeof customCallback === 'function') ? customCallback : webhookCb;

        const server = http.createServer(callback);

        server.listen(port, hostname, () => {
            console.log('Webhook listening on port: %s', port);
        });

        const url = `https://${domain}${hookPath}`;
        const allowed_updates = this.bot.botConfig.allowedUpdates;
        this.bot.connectWebhook({ url, allowed_updates });
    };

    /**
     * Handles incoming webhook responses.
     * @param {string} hookPath - The path for the webhook.
     * @param {function} updateHandler - The function to call with the parsed update.
     * @returns {function} The request handler function.
     */
    handleResponse(hookPath, updateHandler) {
        return (req, res, next) => {
            if (req.method !== 'POST' || req.url !== hookPath) {
                if (typeof next === 'function') {
                    return next();
                };
                res.statusCode = 403; // Forbidden
                return res.end();
            };

            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                let update;
                try {
                    update = JSON.parse(body);
                } catch (error) {
                    res.writeHead(415); // Unsupported Media Type
                    res.end();
                    console.error('Error parsing JSON:', error);
                    return;
                }
                updateHandler(update); // Pass the update to the handler
                res.end();
            });
        };
    };
};

module.exports = TelegramWebhook;