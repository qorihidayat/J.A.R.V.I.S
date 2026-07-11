const ora = require("ora");
const {search} = require("../tools/api/search");
const {default: axios} = require("axios");
const {contentRouter} = require("../router/contentRouter");

async function handleSearch(prompt) {

    const spinner = ora("Searching...").start();
    let query = prompt.split("@search")[1].trim();
    let result = await contentRouter(query);
    if (! result) {
        query = prompt.replace("@search", "").trim();

        if (! query) {

            spinner.fail("Query tidak boleh kosong");

            return null;

        }

        result = await search(query);
    }
    spinner.succeed("Done");

    return result;

}


module.exports = {
    handleSearch
};
