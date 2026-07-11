const { tavily } = require("@tavily/core");
require("dotenv").config();

async function deepSearch(query) {
    const tvly = tavily({
        apiKey: process.env.TAVILY_API_KEY
    });

    const response = await tvly.search(query, {
        max_results: 3
    });

    return response.results;
}

module.exports = {
    deepSearch
};