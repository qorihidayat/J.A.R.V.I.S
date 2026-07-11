const { exec } = require("child_process");

function runCommand(command) {

    return new Promise((resolve, reject) => {

        exec(command, (err, stdout, stderr) => {

            if (err) {

                reject(err.message);

                return;

            }

            resolve(stdout || stderr);

        });

    });

}

module.exports = { runCommand };