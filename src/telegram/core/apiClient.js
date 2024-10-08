const fs = require('fs');
// const fetch = require('node-fetch');
// const FormData = require('form-data');

class APIClient {
    constructor(botConfig) {
        this.token = botConfig.token;
        this.isTestMode = botConfig.isTestMode;
        this.baseApiUrl = botConfig.baseApiUrl;
    };

    buildURL(path) {
        const envPath = this.isTestMode ? '/test' : '';
        return `${this.baseApiUrl}/bot${this.token}${envPath}/${path}`;
    };

    preparePayload(options) {
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

    request(path, options) {
        const payload = this.preparePayload(options);
        const url = this.buildURL(path);

        return fetch(url, payload).then(res => res.json()).then(function (response) {
            if (!response.ok) {
                throw new Error(`Error Code : ${response.error_code} : ${response.description}`);
            };
            return response.result;
        });
    };
};

module.exports = APIClient;