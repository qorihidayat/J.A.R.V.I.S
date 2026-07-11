const axios = require("axios");
const config = require("./config");

async function askLLM(options) {

    const response = await axios.post(

        config.api,

        {
            model: config.model,
            ...options
        }

    );

    return response.data;

}

module.exports = {
    askLLM
};