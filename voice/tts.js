const { spawn } = require("child_process");
const path = require("path");

let pyProcess = null;
let currentResolve = null;
let currentReject = null;
let isReady = false;
const pendingQueue = [];

function initTTS() {
    if (pyProcess) return;

    pyProcess = spawn("python", [
        path.join(__dirname, "speak.py")
    ]);

    pyProcess.stdout.on("data", data => {
        const lines = data.toString().split(/\r?\n/);
        for (let line of lines) {
            line = line.trim();
            if (line === "READY") {
                isReady = true;
                processQueue();
            } else if (line === "DONE") {
                if (currentResolve) {
                    const res = currentResolve;
                    currentResolve = null;
                    currentReject = null;
                    res();
                }
                processQueue();
            } else if (line.startsWith("ERROR:")) {
                if (currentReject) {
                    const rej = currentReject;
                    currentResolve = null;
                    currentReject = null;
                    rej(new Error(line));
                }
                processQueue();
            } else if (line) {
                console.log(`[TTS] ${line}`);
            }
        }
    });

    pyProcess.stderr.on("data", data => {
        // console.error(`[TTS Error] ${data.toString()}`);
    });

    pyProcess.on("close", code => {
        pyProcess = null;
        isReady = false;
    });
}

function processQueue() {
    if (!isReady || currentResolve || pendingQueue.length === 0) return;
    const next = pendingQueue.shift();
    currentResolve = next.resolve;
    currentReject = next.reject;
    pyProcess.stdin.write(next.text + "\n");
}

function speak(text) {
    if (!text) return Promise.resolve();
    initTTS();
    return new Promise((resolve, reject) => {
        const cleanText = text.replace(/\r?\n/g, " ").trim();
        if (!cleanText) {
            resolve();
            return;
        }
        pendingQueue.push({ text: cleanText, resolve, reject });
        processQueue();
    });
}

// Cleanup process on exit
process.on("exit", () => {
    if (pyProcess) {
        pyProcess.kill();
    }
});

module.exports = {
    speak
};