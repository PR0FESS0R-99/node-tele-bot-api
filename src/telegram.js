const EventEmitter = require('events').EventEmitter;
const MessageTypes = require("./types/messageTypes");
const ParseMode = require("./types/parseMode");

class NodeTeleBotAPI {
    constructor(botToken, options = {}) {
        this.botToken = botToken;
        this.started = false;

        this.options = {
            baseApiUrl: options.baseApiUrl || 'https://api.telegram.org',
            timeout: options.timeout || 500,
            limit: options.limit || 100,
            testEnvironment: options.testEnvironment || false
        };

        this.callbackEvent = new EventEmitter();
        this.messageTypeEvent = new EventEmitter();
        this.commandEvent = new EventEmitter();
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

    // ==== ==== ==== ==== ==== ==== ==== //

    // Basic Events

    // ==== ==== ==== ==== ==== ==== ==== //

    // Command Event
    onCommand(command, callback) {
        this.commandEvent.on(command.toLowerCase(), callback);
    };

    // Message Type Event
    onMessage(messageType, callback) {
        this.messageTypeEvent.on(messageType, callback);
    };

    onCallbackQuery(query, callback) {
        if (!callback) {
            callback = query;
            query = 'callback_query';
        }
        this.callbackEvent.on(query, callback);
    };

    // ==== ==== ==== ==== ==== ==== ==== //

    // Available Methods

    // ==== ==== ==== ==== ==== ==== ==== //

    // getMe
    getMe() {
        return this.#request("getMe");
    };

    // sendMessage
    sendMessage({ text, chat_id, reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            text,
            chat_id,
            reply_markup,
            parse_mode,
            ...args
        };
        return this.#request("sendMessage", options);
    };

    // forwardMessage
    forwardMessage({ chat_id, from_chat_id, message_id, disable_notification = false, ...args }) {
        const options = {
            chat_id,
            from_chat_id,
            message_id,
            disable_notification,
            ...args
        };
        return this.#request("forwardMessage", options);
    };

    // forwardMessages
    forwardMessages({ chat_id, from_chat_id, message_ids, disable_notification = false, ...args }) {
        const options = {
            chat_id,
            from_chat_id,
            message_ids: JSON.parse(message_ids),
            disable_notification,
            ...args
        };
        return this.#request("forwardMessages", options);
    };

    // copyMessage
    copyMessage({ chat_id, from_chat_id, message_id, caption = "", reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            chat_id,
            from_chat_id,
            message_id,
            caption,
            parse_mode,
            reply_markup,
            ...args
        };
        return this.#request("copyMessage", options);
    };

    // copyMessage
    copyMessages({ chat_id, from_chat_id, message_ids, caption = "", reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            chat_id,
            from_chat_id,
            message_ids: JSON.parse(message_ids),
            caption,
            parse_mode,
            reply_markup,
            ...args
        };
        return this.#request("copyMessage", options);
    }; F

    // sendPhoto
    sendPhoto({ photo, chat_id, caption = "", reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            photo,
            chat_id,
            caption,
            parse_mode,
            reply_markup,
            ...args
        };
        return this.#request("sendPhoto", options);
    };

    // sendAudio
    sendAudio({ audio, chat_id, caption = "", duration = 0, performer = "", title = "", reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            audio,
            chat_id,
            caption,
            parse_mode,
            duration,
            performer,
            title,
            reply_markup,
            ...args
        };
        return this.#request("sendAudio", options);
    };

    // sendDocument
    sendDocument({ document, chat_id, caption = "", reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            document,
            chat_id,
            caption,
            parse_mode,
            reply_markup,
            ...args
        };
        return this.#request("sendDocument", options);
    };

    // sendVideo
    sendVideo({ video, chat_id, caption = "", duration = 0, width = 0, height = 0, reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            video,
            chat_id,
            caption,
            parse_mode,
            duration,
            width,
            height,
            reply_markup,
            ...args
        };
        return this.#request("sendVideo", options);
    };

    // sendAnimation
    sendAnimation({ animation, chat_id, caption = "", duration = 0, width = 0, height = 0, reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            animation,
            chat_id,
            caption,
            parse_mode,
            duration,
            width,
            height,
            reply_markup,
            ...args
        };
        return this.#request("sendAnimation", options);
    };

    // sendVoice
    sendVoice({ voice, chat_id, caption = "", duration = 0, reply_markup = "", parse_mode = ParseMode.HTML, ...args }) {
        const options = {
            voice,
            chat_id,
            caption,
            parse_mode,
            duration,
            reply_markup,
            ...args
        };
        return this.#request("sendVoice", options);
    };

    // sendVideoNote
    sendVideoNote({ video_note, chat_id, duration = 0, length = 0, reply_markup = "", ...args }) {
        const options = {
            video_note,
            chat_id,
            duration,
            length,
            reply_markup,
            ...args
        };
        return this.#request("sendVideoNote", options);
    };

    // sendMediaGroup
    sendMediaGroup({ media, chat_id, ...args }) {
        const options = {
            media,
            chat_id,
            ...args
        };
        return this.#request("sendMediaGroup", options);
    };

    // sendLocation
    sendLocation({ chat_id, latitude, longitude, live_period = "", reply_markup = "", ...args }) {
        const options = {
            chat_id,
            latitude,
            longitude,
            live_period,
            reply_markup,
            ...args
        };
        return this.#request("sendLocation", options);
    };

    // sendVenue
    sendVenue({ chat_id, latitude, longitude, title, address, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            latitude,
            longitude,
            title,
            address,
            reply_markup,
            ...args
        };
        return this.#request("sendVenue", options);
    };

    // sendContact
    sendContact({ chat_id, phone_number, first_name, last_name = "", vcard = "", reply_markup = "", ...args }) {
        const options = {
            chat_id,
            phone_number,
            first_name,
            last_name,
            vcard,
            reply_markup,
            ...args
        };
        return this.#request("sendContact", options);
    };

    // sendPoll
    sendPoll({ chat_id, question, options, is_anonymous = true, type = "regular", allows_multiple_answers = false, correct_option_id = null, explanation = "", reply_markup = "", ...args }) {
        const optionsBody = {
            chat_id,
            question,
            options,
            is_anonymous,
            type,
            allows_multiple_answers,
            correct_option_id,
            explanation,
            reply_markup,
            ...args
        };
        return this.#request("sendPoll", optionsBody);
    };

    // sendDice
    sendDice({ chat_id, emoji = "", reply_markup = "", ...args }) {
        const options = {
            chat_id,
            emoji,
            reply_markup,
            ...args
        };
        return this.#request("sendDice", options);
    };

    // sendChatAction
    sendChatAction({ chat_id, action, ...args }) {
        const options = {
            chat_id,
            action,
            ...args
        };
        return this.#request("sendChatAction", options);
    };

    // setMessageReaction
    setMessageReaction({ chat_id, message_id, reaction = "", is_big = false, ...args }) {
        const options = {
            chat_id,
            message_id,
            reaction,
            is_big,
            ...args
        };
        return this.#request("setMessageReaction", options);
    };

    // getUserProfilePhotos
    getUserProfilePhotos({ user_id, offset = 0, limit = 100, ...args }) {
        const options = {
            user_id,
            offset,
            limit,
            ...args
        };
        return this.#request("getUserProfilePhotos", options);
    };

    // getFile
    getFile({ file_id }) {
        const options = {
            file_id,
        };
        return this.#request("getFile", options);
    };

    // Get Download File Link
    getDownloadLink({ file_id }) {
        return this.getFile({ file_id }).then(function (response) {
            return `${this.options.baseApiUrl}/file/bot${this.botToken}/${response.file_path}`
        }.bind(this)).catch(error => {
            return { error: error.message }
        });
    };

    // banChatMember
    banChatMember({ chat_id, user_id, until_date = "", revoke_messages = false }) {
        const options = {
            chat_id,
            user_id,
            until_date,
            revoke_messages
        };
        return this.#request("banChatMember", options);
    };

    // unbanChatMember
    unbanChatMember({ chat_id, user_id, only_if_banned }) {
        const options = {
            chat_id,
            user_id,
            only_if_banned
        };
        return this.#request("unbanChatMember", options);
    };

    // restrictChatMember
    restrictChatMember({ chat_id, user_id, permissions, until_date = "", ...args }) {
        const options = {
            chat_id,
            user_id,
            permissions,
            until_date,
            ...args
        };
        return this.#request("restrictChatMember", options);
    };

    // promoteChatMember
    promoteChatMember({ chat_id, user_id, is_anonymous = false, can_manage_chat = false, can_post_messages = false, can_edit_messages = false, can_delete_messages = false, can_manage_video_chats = false, can_restrict_members = false, can_promote_members = false, ...args }) {
        const options = {
            chat_id,
            user_id,
            is_anonymous,
            can_manage_chat,
            can_post_messages,
            can_edit_messages,
            can_delete_messages,
            can_manage_video_chats,
            can_restrict_members,
            can_promote_members,
            ...args
        };
        return this.#request("promoteChatMember", options);
    };

    // setChatAdministratorCustomTitle
    setChatAdministratorCustomTitle({ chat_id, user_id, custom_title }) {
        const options = {
            chat_id,
            user_id,
            custom_title,
        };
        return this.#request("setChatAdministratorCustomTitle", options);
    };

    // banChatSenderChat
    banChatSenderChat({ chat_id, sender_chat_id }) {
        const options = {
            chat_id,
            sender_chat_id
        };
        return this.#request("banChatSenderChat", options);
    };

    // unbanChatSenderChat
    unbanChatSenderChat({ chat_id, sender_chat_id }) {
        const options = {
            chat_id,
            sender_chat_id
        };
        return this.#request("unbanChatSenderChat", options);
    };


    // setChatPermissions
    setChatPermissions({ chat_id, permissions, ...args }) {
        const options = {
            chat_id,
            permissions,
            ...args
        };
        return this.#request("setChatPermissions", options);
    }

    // exportChatInviteLink
    exportChatInviteLink({ chat_id }) {
        const options = {
            chat_id
        };
        return this.#request("exportChatInviteLink", options);
    }

    // createChatInviteLink
    createChatInviteLink({ chat_id, name = "", expire_date = 0, member_limit = 0, creates_join_request = false }) {
        const options = {
            chat_id,
            name,
            expire_date,
            member_limit,
            creates_join_request,
        };
        return this.#request("createChatInviteLink", options);
    }

    // editChatInviteLink
    editChatInviteLink({ chat_id, invite_link, name = "", expire_date = 0, member_limit = 0, creates_join_request = false }) {
        const options = {
            chat_id,
            invite_link,
            name,
            expire_date,
            member_limit,
            creates_join_request
        };
        return this.#request("editChatInviteLink", options);
    }

    // revokeChatInviteLink
    revokeChatInviteLink({ chat_id, invite_link }) {
        const options = {
            chat_id,
            invite_link
        };
        return this.#request("revokeChatInviteLink", options);
    }

    // approveChatJoinRequest
    approveChatJoinRequest({ chat_id, user_id }) {
        const options = {
            chat_id,
            user_id,
        };
        return this.#request("approveChatJoinRequest", options);
    }

    // declineChatJoinRequest
    declineChatJoinRequest({ chat_id, user_id }) {
        const options = {
            chat_id,
            user_id,
        };
        return this.#request("declineChatJoinRequest", options);
    }

    // setChatPhoto
    setChatPhoto({ chat_id, photo }) {
        const options = {
            chat_id,
            photo
        };
        return this.#request("setChatPhoto", options);
    }

    // deleteChatPhoto
    deleteChatPhoto({ chat_id }) {
        const options = {
            chat_id
        };
        return this.#request("deleteChatPhoto", options);
    }

    // setChatTitle
    setChatTitle({ chat_id, title }) {
        const options = {
            chat_id,
            title
        };
        return this.#request("setChatTitle", options);
    }

    // setChatDescription
    setChatDescription({ chat_id, description = "" }) {
        const options = {
            chat_id,
            description
        };
        return this.#request("setChatDescription", options);
    }

    // pinChatMessage
    pinChatMessage({ chat_id, message_id, disable_notification = false, ...args }) {
        const options = {
            chat_id,
            message_id,
            disable_notification,
            ...args
        };
        return this.#request("pinChatMessage", options);
    }

    // unpinChatMessage
    unpinChatMessage({ chat_id, message_id, ...args }) {
        const options = {
            chat_id,
            message_id,
            ...args
        };
        return this.#request("unpinChatMessage", options);
    }

    // unpinAllChatMessages
    unpinAllChatMessages({ chat_id }) {
        const options = {
            chat_id
        };
        return this.#request("unpinAllChatMessages", options);
    }

    // leaveChat
    leaveChat({ chat_id }) {
        const options = {
            chat_id
        };
        return this.#request("leaveChat", options);
    }

    // getChat
    getChat({ chat_id }) {
        const options = {
            chat_id,
        };
        return this.#request("getChat", options);
    }

    // getChatAdministrators
    getChatAdministrators({ chat_id }) {
        const options = {
            chat_id,
        };
        return this.#request("getChatAdministrators", options);
    }

    // getChatMemberCount
    getChatMemberCount({ chat_id }) {
        const options = {
            chat_id,
        };
        return this.#request("getChatMemberCount", options);
    }

    // getChatMember
    getChatMember({ chat_id, user_id }) {
        const options = {
            chat_id,
            user_id,
        };
        return this.#request("getChatMember", options);
    }

    // setChatStickerSet
    setChatStickerSet({ chat_id, sticker_set_name }) {
        const options = {
            chat_id,
            sticker_set_name,
        };
        return this.#request("setChatStickerSet", options);
    }

    // deleteChatStickerSet
    deleteChatStickerSet({ chat_id }) {
        const options = {
            chat_id,
        };
        return this.#request("deleteChatStickerSet", options);
    }

    // answerCallbackQuery
    answerCallbackQuery({ callback_query_id, text = "", show_alert = false, url = "", cache_time = 0 }) {
        const options = {
            callback_query_id,
            text,
            show_alert,
            url,
            cache_time,
        };
        return this.#request("answerCallbackQuery", options);
    };

    // editMessageText
    editMessageText({ chat_id, message_id, text, reply_markup = "", ...argsF }) {
        const options = {
            chat_id,
            message_id,
            text,
            reply_markup,
            ...args
        }
        return this.#request('editMessageText', options);
    };

    // editMessageCaption
    editMessageCaption({ chat_id, message_id, caption, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            message_id,
            caption,
            reply_markup,
            ...args
        }
        return this.#request('editMessageCaption', options);
    };

    // editMessageMedia
    editMessageMedia({ chat_id, message_id, media, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            message_id,
            media,
            reply_markup,
            ...args
        }
        return this.#request('editMessageMedia', options);
    };

    // editMessageLiveLocation
    editMessageLiveLocation({ chat_id, message_id, latitude, longitude, live_period, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            message_id,
            latitude,
            longitude,
            live_period,
            reply_markup,
            ...args
        }
        return this.#request('editMessageLiveLocation', options);
    };

    // stopMessageLiveLocation
    stopMessageLiveLocation({ chat_id, message_id, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            message_id,
            reply_markup,
            ...args
        }
        return this.#request('stopMessageLiveLocation', options);
    };

    // editMessageReplyMarkup
    editMessageReplyMarkup({ chat_id, message_id, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            message_id,
            reply_markup,
            ...args
        }
        return this.#request('editMessageReplyMarkup', options);
    };

    // stopPoll
    stopPoll({ chat_id, message_id, reply_markup = "", ...args }) {
        const options = {
            chat_id,
            message_id,
            reply_markup,
            ...args
        }
        return this.#request('stopPoll', options);
    };

    // deleteMessage
    deleteMessage({ chat_id, message_id }) {
        const options = {
            chat_id,
            message_id
        }
        return this.#request('deleteMessage', options);
    };

    // deleteMessages
    deleteMessages({ chat_id, message_ids }) {
        const options = {
            chat_id,
            message_ids
        };
        return this.#request('deleteMessages', options);
    };

    // ==== ==== ==== ==== ==== ==== ==== //

    // Telegram API Managment

    // ==== ==== ==== ==== ==== ==== ==== //

    #buildURL(path) {
        const envPath = this.options.testEnvironment ? '/test' : '';
        return `${this.options.baseApiUrl}/bot${this.botToken}${envPath}/${path}`;
    };

    #preparePayload(options) {
        if (!options) {
            return { method: 'GET' };
        };

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

    #getUpdates({ offset, timeout, limit }) {
        const path = `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`
        return this.#request(path);
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

    #handleUpdate(update) {
        let offset = update.update_id + 1;

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
            limit: this.options.limit,
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

module.exports.NodeTeleBotAPI = NodeTeleBotAPI;