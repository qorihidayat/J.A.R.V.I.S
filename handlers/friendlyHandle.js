const ora = require("ora");
const { friendly } = require("../agent/friendly");
const { memoryAgent } = require("../agent/memoryAgent");

async function handleFriendly(prompt, history){

    const spinner = ora("Thinking...").start();

    const reply = await friendly(prompt,history);

    await memoryAgent(prompt);

    spinner.succeed("Done");

    return reply;

}

module.exports = {
    handleFriendly
};