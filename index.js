const readline = require("readline");
const {intro} = require("./intro");
const config = require("./config");
const { handlePrompt } = require("./handlers/promptHendler");
const chalk = require("chalk");
let history = [];

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    await intro();

    while (true) {
        const prompt = await ask(chalk.yellow("🐝 You ") + chalk.gray("> "));

        if (prompt === "exit") break;

        try {
            const result = await handlePrompt(prompt, history);

            if (result === null) continue;

            console.log(
                chalk.cyan(`🤖 ${config.aiName} `) + chalk.gray("> "),
                result
            );

            history.push({
                role: "user",
                content: prompt
            });

            history.push({
                role: "assistant",
                content: typeof result === "string"
                    ? result
                    : JSON.stringify(result)
            });

        } catch (err) {
            console.error(chalk.red(err.message));
        }
    }

    rl.close();
}

main();
