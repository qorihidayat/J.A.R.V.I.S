const { spawn } = require("child_process");
const path = require("path");
const configAll = require("../config");

const config = {
    model: path.join(__dirname, "..", "whisper", "models", "ggml-small.bin"),
    language: configAll.lang === "indonesia" ? "id" : "en",
    captureName: "REXUS",
    capture: 11,
    vad: 0.85,
    step: 0,
    length: 10000,
};

const WHISPER_EXE = path.join(
    __dirname,
    "..",
    "whisper",
    "whisper-stream.exe"
);

const IGNORED_PHRASES = new Set([
    "terima kasih",
    "terima kasih banyak",
    "thank you",
    "thank you very much",
    "yandex",
    "amara.org",
    "you",
    "[suara perbincangan]",
]);

function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}

function isHallucination(text) {
    const clean = normalize(text);
    if (!clean)
        return true;
    if (IGNORED_PHRASES.has(clean))
        return true;
    if (clean.includes("subtitles by"))
        return true;
    if (/^\[.*\]$/.test(text.trim()))
        return true;
    if (/^\(.*\)$/.test(text.trim()))
        return true;
    return false;
}

function getAudioDevices() {
    return new Promise((resolve) => {

        const child = spawn(WHISPER_EXE, ["-c", "999"]);

        let output = "";

        child.stdout.on("data", d => output += d.toString());
        child.stderr.on("data", d => output += d.toString());

        child.on("close", () => {

            const devices = [];

            output.split(/\r?\n/).forEach(line => {

                const m = line.match(/Capture device #(\d+):\s*'(.*)'/);

                if (!m) return;

                devices.push({
                    id: Number(m[1]),
                    name: m[2]
                });

            });

            resolve(devices);

        });

        child.on("error", () => resolve([]));

    });
}

async function startWhisper(onText) {

    const devices = await getAudioDevices();

    let captureId = config.capture;

    if (config.captureName) {

        const found = devices.find(d =>
            d.name.toLowerCase().includes(config.captureName.toLowerCase())
        );

        if (found) {
            captureId = found.id;
            // console.log(`[Whisper] Device: ${found.name}`);
        } else {
            // console.log(`[Whisper] Device fallback: #${captureId}`);
        }
    }

    const child = spawn(WHISPER_EXE, [
        "-m", config.model,
        "-l", config.language,
        "-c", captureId.toString(),
        "-vth", config.vad.toString(),
        "--step", config.step.toString(),
        "--length", config.length.toString()
    ]);

    let lastText = "";
    let lastTime = 0;

    child.stdout.on("data", buffer => {

        const lines = buffer.toString().split(/\r?\n/);

        for (const line of lines) {

            const match = line.match(
                /\[\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}\]\s*(.*)/
            );

            if (!match) continue;

            const text = match[1].trim();

            if (!text) continue;
            if (isHallucination(text)) continue;
            if (/^\(.*\)$/.test(text)) continue;

            const now = Date.now();

            if (text === lastText && (now - lastTime) < 3000)
                continue;

            lastText = text;
            lastTime = now;

            onText(text);
        }

    });

    child.stderr.on("data", () => {});

    child.on("close", code => {
        // console.log(`[Whisper] exited (${code})`);
    });

    return {

        kill() {
            return new Promise(resolve => {

                child.once("close", () => resolve());

                if (!child.killed) {
                    child.kill();
                } else {
                    resolve();
                }

            });
        }

    };

}

module.exports = {
    startWhisper
};