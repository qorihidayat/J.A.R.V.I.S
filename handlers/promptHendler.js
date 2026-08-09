const { whoami } = require("../intro");
const { handleTools } = require("./handleTools");
const { handleExcel } = require("./excelHandle");
const { handleSearch } = require("./searchHandle");
const { handleFriendly } = require("./friendlyHandle");
const { workspace } = require("../agent/workspace");
const { contentRouter } = require("../router/contentRouter");
const { handleProject } = require("./projectHandle");

async function handlePrompt(prompt, history) {

    if (prompt.startsWith("--help"))
        return whoami();

    if (prompt.startsWith("@tools"))
        return handleTools(prompt);

    if (prompt.startsWith("@workspace"))
        return workspace(prompt);

    if (prompt.startsWith("@project"))
        return handleProject(prompt);

    if (prompt.startsWith("@excel"))
        return handleExcel(prompt);

    if (prompt.startsWith("@search") || prompt.startsWith("@image") || prompt.startsWith("@music"))
        return contentRouter(prompt);

    return handleFriendly(prompt, history);
}

module.exports = {
    handlePrompt
};
