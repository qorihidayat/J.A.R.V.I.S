const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
let failed = false;

function check(label, condition, fix) {
  const icon = condition ? "OK" : "MISSING";
  console.log(`[${icon}] ${label}`);
  if (!condition) {
    failed = true;
    if (fix) console.log(`  Fix: ${fix}`);
  }
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function commandExists(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", shell: process.platform === "win32" });
  return !result.error && result.status === 0;
}

console.log("Jarvis environment check\n");

check("Node.js 20+", Number(process.versions.node.split(".")[0]) >= 20, "Install Node.js 20 LTS or newer.");
check("Python Launcher (py -3)", commandExists("py", ["-3", "--version"]), "Install Python 3.10+ and enable the Python Launcher.");
check("Python voice environment", exists(".venv/Scripts/python.exe"), "Run: .\\setup.ps1");
check(".env", exists(".env"), "Copy .env.example to .env if you plan to use @search or @image.");
check("Whisper runtime", exists("whisper/whisper-stream.exe"), "Install/copy whisper.cpp runtime into whisper/.");
check("Whisper model", exists("whisper/models/ggml-small.bin"), "Download ggml-small.bin into whisper/models/.");
check("Kokoro ONNX model", exists("voice/models/kokoro-v1.0.fp16-gpu.onnx"), "Download the Kokoro ONNX model into voice/models/.");
check("Kokoro voice pack", exists("voice/voices/voices-v1.0.bin"), "Download voices-v1.0.bin into voice/voices/.");
check("Graphify index", exists("graphify-out/graph.json"), "Run: py -3 -m uv tool run --from graphifyy graphify . --code-only");

console.log("\nNode dependencies:");
for (const dependency of ["axios", "chalk", "ora", "gradient-string", "boxen", "exceljs", "dotenv"]) {
  try {
    require.resolve(dependency);
    check(dependency, true);
  } catch {
    check(dependency, false, "Run: npm install");
  }
}

if (failed) {
  console.log("\nDoctor found missing prerequisites.");
  process.exitCode = 1;
} else {
  console.log("\nJarvis prerequisites are ready.");
}
