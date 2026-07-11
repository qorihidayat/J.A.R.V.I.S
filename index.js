const readline = require("readline");
const {parseIntent} = require("./agent/intentParser");
const {router} = require("./router");
const {friendly} = require("./agent/friendly");
const {memoryAgent} = require("./agent/memoryAgent");
const {workspace} = require("./agent/workspace");
const chalk = require("chalk");
const ora = require("ora");
const {qaEngineer} = require("./agent/qaEngineer");
const {intro, whoami} = require("./intro");
const config = require("./config");
const { readExcel } = require("./tools/readExcel");
const excelAgent = require("./agent/excelAgent");
const { writeExcel } = require("./tools/writeExcel");
let history = [];
let memory;

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

        if (prompt === "exit") {
            break;
        }
        try {
            let intent,
                result,
                spinner;
            if (prompt.startsWith("--help")) {
                console.log(whoami());
            }else if (prompt.startsWith("@tools")) {
                console.log("\nParsing Intent...");
                intent = await parseIntent(prompt);
                console.log(intent);
                spinner = ora("Executing......").start();
                result = await router(intent);
                spinner.succeed("Done");
            } else if (prompt.startsWith("@workspace")) {
                result = await workspace(prompt);
            } else if (prompt.startsWith("@excel")) {
                spinner = ora("Exceling...").start();
                const data = await readExcel(`${process.cwd()}${config.filePathExcel}`);
                result = await excelAgent(prompt, data);
                await writeExcel(`${process.cwd()}${config.filePathExcel}`, result.actions);
                spinner.succeed("Done");
            } else {
                result = await friendly(prompt, history);
                spinner = ora("Thinking...").start();
                memory = await memoryAgent(prompt);
                spinner.succeed("Done");
            }
            console.log(chalk.cyan(`🤖 ${config.aiName} `) + chalk.gray("> "), result);
            history.push({role: "user", content: prompt});
            history.push({role: "assistant", content: result});
        } catch (err) {
            console.log(err.message);
        }
        // break;
    }rl.close();
}

main();
