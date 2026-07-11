const ora = require("ora");
const {search} = require("../tools/api/search");
const {parseIntent} = require("../agent/intentParser");
const {router} = require("../router/router");
const { contentRouter } = require("../router/contentRouter");
async function handleTools(prompt) {

    const spinner = ora("Executing...").start();
    let result = "";
    if (prompt.includes("@search")) {
        let query = prompt.split("@search")[1].trim();
        result = await contentRouter(query);
        if (!result) {
            const response = await search(query);
            result = `Judul: ${
                response[0].title
            } \nURL: ${
                response[0].url
            }\nContent: ${
                response[0].content
            }`;
        }
        prompt = prompt.split("@search")[0].trim() + result + `Rapihkan informasi ini dan berikan kepada user`;
    }

    const intent = await parseIntent(prompt);

    result = await router(intent);

    spinner.succeed("Done");

    console.log(JSON.stringify(intent, null, 2));

    return result;
}

module.exports = {
    handleTools
};
