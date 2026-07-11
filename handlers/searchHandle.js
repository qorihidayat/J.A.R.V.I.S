const ora = require("ora");
const { deepSearch } = require("../tools/tavily");

async function handleSearch(prompt){

    const spinner = ora("Searching...").start();

    const query = prompt.replace("@search","").trim();

    if(!query){

        spinner.fail("Query tidak boleh kosong");

        return null;

    }

    const result = await deepSearch(query);

    spinner.succeed("Done");

    return result;

}


module.exports = {
    handleSearch
};
