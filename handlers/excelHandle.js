const ora = require("ora");
const { readExcel } = require("../tools/readExcel");
const { excelAgent } = require("../agent/excelAgent");
const { writeExcel } = require("../tools/writeExcel");
const config = require("../config");

async function handleExcel(prompt){

    const spinner = ora("Exceling...").start();

    const data = await readExcel(`${process.cwd()}${config.filePathExcel}`);

    const result = await excelAgent(prompt,data);

    await writeExcel(`${process.cwd()}${config.filePathExcel}`, result.actions);

    spinner.succeed("Done");

    return result;

}

module.exports = {
    handleExcel
};