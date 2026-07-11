const gradient = require("gradient-string");
const boxen = require("boxen");
const chalk = require("chalk");
const config = require("./config");

async function intro() {
    console.log(
        gradient.fruit(`                               
   ██   ▄████▄   █████▄   ██  ██   ██   ▄█████ 
   ██   ██▄▄██   ██▄▄██▄  ██▄▄██   ██   ▀▀▀▄▄▄ 
████▀ ▄ ██  ██ ▄ ██   ██ ▄ ▀██▀  ▄ ██ ▄ █████▀                                                                                                   
`)
    );

    console.log(
        boxen(
            chalk.yellow.bold(`🤖 ${config.aiName} AI Agent\n\n`) +
            chalk.white("Status : ") +
            chalk.green("READY\n") +
            chalk.white("Model  : ") +
            chalk.cyan(`${config.model}\n`) +
            chalk.white("Version: ") +
            chalk.yellow(`${config.version}\n`) +
            chalk.white("Author : ") +
            chalk.red(`${config.author}\n\n`) +
            chalk.white("use it : \n") +
            chalk.gray(`@tools\n`)+
            chalk.gray(`@excel\n`)+
            chalk.gray(`@workspace\n`),
            {
                padding: 1,
                borderStyle: "round",
                borderColor: "yellow",
            },
        ),
    );
}

function whoami() {
   return `
        🤖 ${config.aiName} AI Agent

Commands:

whoami
  Show available commands and agents.

exit
  Exit ${config.aiName}.

Agents:

@tools
  Create, edit, delete files and folders.

@workspace
  Read and understand files in the current workspace.

@excel
  Read and edit Excel (.xlsx) files using natural language.

Examples:

@tools buat folder test

@workspace jelaskan project ini

@excel tambahkan kolom Total sebelum Diskon
        `;
}

module.exports = {
    intro, whoami
};