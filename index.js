const readline = require("readline");
const {intro} = require("./intro");
const config = require("./config");
const { handlePrompt } = require("./handlers/promptHendler");
const { startWhisper } = require("./voice/stream");
const chalk = require("chalk");
const { speak } = require("./voice/tts");

let history = [];
let isProcessing = false;
let result = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.yellow("🐝 You ") + chalk.gray("> ")
});

async function executePrompt(prompt, source = "Keyboard") {
    if (isProcessing) return;
    isProcessing = true;

    if (source === "Voice") {
        // Clear the current line where CLI prompt was shown
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(chalk.yellow(`🐝 You (${source}) `) + chalk.gray("> ") + prompt);
    }

    if (prompt.toLowerCase().trim().includes("exit")) {
        console.log(chalk.red("Goodbye Capt!"));
        process.exit(0);
    }

    try {
        result = await handlePrompt(prompt, history);

        if (result !== null) {
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
        }
    } catch (err) {
        console.error(chalk.red(err.message));
    } finally {
        isProcessing = false;
        await speak(result);
        rl.prompt();
    }
}

rl.on("line", async (line) => {
    const prompt = line.trim();
    if (prompt === "") {
        rl.prompt();
        return;
    }
    await executePrompt(prompt, "Keyboard");
});

async function main() {
    await intro();

    // Start Whisper voice stream in the background
    await startWhisper(async (text) => {
        if (text.trim() === "") return;
        await executePrompt(text, "Voice");
    });
    rl.prompt();
}

main();
