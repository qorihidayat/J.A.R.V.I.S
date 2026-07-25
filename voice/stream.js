const { spawn } = require("child_process");
const path = require("path");

const config = {
    model: path.join(__dirname, "..", "whisper", "models", "ggml-small.bin"),
    language: "id",
    captureName: "REXUS", // Nama perangkat mic (atau kata kunci nama mic, case-insensitive). Contoh: "REXUS", "Voicemeeter", dll.
    capture: 11,          // Fallback ID jika captureName tidak ditemukan/tidak diatur
    vad: 0.65,
    step: 0,
    length: 10000
};

function getAudioDevices() {
    return new Promise((resolve) => {
        const whisper = spawn(
            path.join(__dirname, "..", "whisper", "whisper-stream.exe"),
            ["-c", "999"]
        );
        let output = "";
        
        whisper.stdout.on("data", (data) => { output += data.toString(); });
        whisper.stderr.on("data", (data) => { output += data.toString(); });
        
        whisper.on("error", (err) => {
            console.error("[Whisper Error] Gagal menjalankan whisper-stream untuk deteksi perangkat:", err.message);
            resolve([]);
        });

        whisper.on("close", () => {
            const devices = [];
            const lines = output.split(/\r?\n/);
            lines.forEach((line) => {
                const match = line.match(/Capture device #(\d+):\s*'(.*)'/);
                if (match) {
                    devices.push({
                        id: parseInt(match[1], 10),
                        name: match[2]
                    });
                }
            });
            resolve(devices);
        });
    });
}

async function startWhisper(onText) {
    const processWrapper = {
        child: null,
        kill: function(signal) {
            if (this.child) {
                this.child.kill(signal);
            }
        }
    };

    const devices = await getAudioDevices();
    let captureId = config.capture;
    
    if (config.captureName) {
        const found = devices.find(d => 
            d.name.toLowerCase().includes(config.captureName.toLowerCase())
        );
        if (found) {
            captureId = found.id;
            console.log(`[Whisper] Menggunakan perangkat: '${found.name}' (Indeks #${found.id})`);
        } else {
            console.warn(`[Whisper Warning] Perangkat dengan nama "${config.captureName}" tidak ditemukan. Menggunakan fallback indeks #${captureId}`);
        }
    } else {
        console.log(`[Whisper] Menggunakan default indeks #${captureId}`);
    }

    const whisper = spawn(
        path.join(__dirname, "..", "whisper", "whisper-stream.exe"),
        [
            "-m", config.model,
            "-l", config.language,
            "-c", captureId.toString(),
            "-vth", config.vad.toString(),
            "--step", config.step.toString(),
            "--length", config.length.toString()
        ]
    );

    processWrapper.child = whisper;

    // Menyimpan teks yang sudah pernah dikirim agar tidak duplikat
    const processedTexts = new Set();

    whisper.stdout.on("data", (data) => {
        const rawOutput = data.toString();

        // Pecah output per baris
        const lines = rawOutput.split(/\r?\n/);

        lines.forEach((line) => {
            // Regex diperbarui untuk mencocokkan '-->' dan menghapus tag timestamp
            const match = line.match(/\[\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}\]\s*(.*)/);

            if (match && match[1]) {
                const spokenText = match[1].trim();

                // Pastikan teks tidak kosong dan belum pernah dikirim sebelumnya
                if (spokenText.length > 0 && !processedTexts.has(spokenText)) {
                    processedTexts.add(spokenText); // Tandai teks sudah diproses

                    if (typeof onText === "function") {
                        onText(spokenText);
                    }
                }
            }
        });
    });

    whisper.stderr.on("data", (data) => {
        // Disembunyikan agar log bersih, atau aktifkan jika ingin melihat log internal
    });

    whisper.on("close", (code) => {
        console.log("Whisper exited:", code);
    });

    return processWrapper;
}

module.exports = {
    startWhisper
};