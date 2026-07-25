const { spawn } = require("child_process");
const path = require("path");

async function speak(text) {
    return new Promise((resolve, reject) => {
        const py = spawn("python", [
            path.join(__dirname, "speak.py"),
            text
        ]);

        py.stdout.on("data", data => {
            console.log(data.toString());
        });

        py.stderr.on("data", data => {
            console.error(data.toString());
        });

        py.on("close", code => {
            if (code === 0) resolve();
            else reject(new Error(`Python exited with code ${code}`));
        });

        py.on("error", reject);

    });
}

module.exports = {
    speak
};