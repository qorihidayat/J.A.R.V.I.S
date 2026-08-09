const ora = require("ora");
const { answerProject } = require("../agent/projectAgent");

async function handleProject(prompt) {
  const question = prompt.replace(/^@project\b/i, "").trim();
  if (!question) {
    return "Gunakan: @project <pertanyaan tentang source code atau nama simbol>.";
  }

  const spinner = ora("Mencari context project...").start();

  try {
    const result = await answerProject(question);

    if (result.mode === "lookup") {
      spinner.succeed(`Menemukan ${result.count} lokasi simbol`);
    } else if (result.mode === "answer") {
      spinner.succeed(`Membaca ${result.count} file project`);
    } else {
      spinner.warn("Symbol tidak ditemukan");
    }

    return result.answer;
  } catch (error) {
    spinner.fail("Project search gagal");
    throw error;
  }
}

module.exports = { handleProject };
