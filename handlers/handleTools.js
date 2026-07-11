const ora = require("ora");
const { deepSearch } = require("../tools/tavily");
const { parseIntent } = require("../agent/intentParser");
const { router } = require("../router");
const { default: axios } = require("axios");
async function handleTools(prompt) {

    const spinner = ora("Executing...").start();

    if (prompt.includes("@search")) {

        const query = prompt.split("@search")[1].trim();
        let result = "";
        if (query.includes("music") || query.includes("lagu") || query.includes("musik") || query.includes("album") || query.includes("band")) {
            const response = await axios.get("https://itunes.apple.com/search?term=" + query + "&entity=song&limit=10");
            response.data.results.forEach((item) => {
                result += item.trackName+" - "+item.artistName+"\n";
            });
        }else{
            const response = await deepSearch(query);
            result = `Judul: ${response[0].title} \nURL: ${response[0].url}\nContent: ${response[0].content} (Rapihkan informasi ini dan berikan kepada user)`;
        }
        prompt =
                prompt.split("@search")[0].trim() +
                result;
        
    }

    const intent = await parseIntent(prompt);

    const result = await router(intent);

    spinner.succeed("Done");

    console.log(JSON.stringify(intent, null, 2));

    return result;
}

module.exports = {
    handleTools
};