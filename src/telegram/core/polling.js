/**
 * Class representing a Telegram polling mechanism.
 */
class TelegramPolling {
    /**
     * Creates an instance of TelegramPolling.
     * @param {NodeTeleBotAPI} bot - The bot instance to use for polling.
     * @param {Object} [options={}] - Configuration options for polling.
     * @param {number} [options.timeout=1] - The timeout for long polling (in seconds).
     * @param {number} [options.limit=100] - The maximum number of updates to retrieve.
     * @param {number} [options.retryDelay=1000] - Delay before retrying on error (in milliseconds).
     */
    constructor(bot, options = {}) {
        this.bot = bot;
        this.offset = 0;

        // Set polling configuration with default values
        this.timeout = options.timeout || bot.polling.timeout || 1; // Set default timeout
        this.limit = options.limit || bot.polling.limit || 100;     // Set default limit
        this.retryDelay = options.retryDelay || 1000;               // Delay before retrying on error
    }

    /**
     * Starts the polling process.
     */
    startPolling() {
        if (!this.bot.botStarted) {
            console.warn("Bot has not started. Polling will not begin.");
            return;
        }
        console.log("Starting polling...");
        this.pollUpdates(); // Start polling for updates
    }

    /**
     * Retrieves updates from the Telegram API.
     * @param {number} offset - The offset for the updates to retrieve.
     * @param {number} timeout - The timeout for long polling.
     * @param {number} limit - The maximum number of updates to retrieve.
     * @returns {Promise<Object[]>} A promise that resolves with the updates.
     */
    getUpdates(offset, timeout, limit) {
        const path = `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`;
        return this.bot.callApi.request(path)
            .catch((error) => {
                console.error("Error fetching updates:", error);
                throw error; // Re-throw to handle it in the caller
            });
    }

    /**
     * Polls for updates continuously.
     */
    pollUpdates() {
        this.getUpdates(this.offset, this.timeout, this.limit)
            .then((updates) => {
                this.processUpdates(updates);
                this.pollUpdates(); // Call itself to continue polling
            })
            .catch((error) => {
                console.error("Polling error, retrying in", this.retryDelay, "ms...", error);
                setTimeout(() => this.pollUpdates(), this.retryDelay); // Retry after specified delay
            });
    }

    /**
     * Processes an array of updates.
     * @param {Object[]} updates - The array of updates received from Telegram.
     * @param {Object} updates[].update_id - The ID of the update.
     * @param {Object} [updates[].message] - The message object if present.
     * @param {Object} [updates[].callback_query] - The callback query object if present.
     */
    processUpdates(updates) {
        const handleUpdate = this.bot.handleUpdate.bind(this.bot);
        updates.forEach(update => {
            this.offset = update.update_id + 1; // Update the offset for next polling
            handleUpdate(update); // Process each update
        });
    };
}

module.exports = TelegramPolling;