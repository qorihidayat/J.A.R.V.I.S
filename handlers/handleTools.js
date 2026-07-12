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
        prompt = result[0].title ? 
        prompt.split("@search")[0].trim() + " | " + JSON.stringify(result[0].title) + " | " + JSON.stringify(result[0].url) + " | " + JSON.stringify(result[0].content) + `Rapihkan informasi ini dan berikan kepada user`:
        prompt.split("@search")[0].trim() + result + `Rapihkan informasi ini dan berikan kepada user`;
    }
    let intent;
    try{
        intent = await parseIntent(prompt);
    }catch(error){
        spinner.fail("Error");
        return error;
    }

    result = await router(intent);

    spinner.succeed("Done");

    console.log(JSON.stringify(intent, null, 2));

    return result;
}

module.exports = {
    handleTools
};
