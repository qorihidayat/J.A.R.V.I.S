import sys
import soundfile as sf
import os
import site
from pathlib import Path

for base in site.getsitepackages():
    base = Path(base)

    dll_dirs = [
        base / "nvidia" / "cublas" / "bin",
        base / "nvidia" / "cudnn" / "bin",
        base / "nvidia" / "cuda_runtime" / "bin",
        base / "nvidia" / "cufft" / "bin",
        base / "nvidia" / "curand" / "bin",
        base / "nvidia" / "nvjitlink" / "bin",
    ]

    for d in dll_dirs:
        if d.exists():
            # print("[DLL]", d)
            os.add_dll_directory(str(d))

from kokoro_onnx import Kokoro
from pathlib import Path
import re
import winsound
import time


BASE_DIR = Path(__file__).resolve().parent

# Read lang from config.js
lang_config = "english"
config_path = BASE_DIR.parent / "config.js"
if config_path.exists():
    try:
        content = config_path.read_text(encoding="utf-8")
        match = re.search(r'lang\s*:\s*["\'`]([^"\'`]+)["\'`]', content)
        if match:
            lang_config = match.group(1).strip().lower()
    except Exception as e:
        pass

if lang_config == "english":
    lang_code = "en-us"
elif lang_config == "indonesia":
    lang_code = "id-id"
else:
    lang_code = "en-us"

# Load the model ONCE
kokoro = Kokoro(
    f"{BASE_DIR}/models/kokoro-v1.0.fp16-gpu.onnx",
    f"{BASE_DIR}/voices/voices-v1.0.bin"
)

# print("Model:", kokoro.sess._model_path)
# print("Provider:", kokoro.sess.get_providers())

def run_tts(text_to_speak):
    if not text_to_speak.strip():
        return
    try:
        t1 = time.perf_counter()
        samples, sample_rate = kokoro.create(
            text_to_speak,
            voice="am_adam",
            speed=1.0,
            lang=lang_code
        )
        print("Generate:", time.perf_counter() - t1)
        t2 = time.perf_counter()
        sf.write("output.wav", samples, sample_rate)
        print("Write:", time.perf_counter() - t2)
        t3 = time.perf_counter()
        winsound.PlaySound("output.wav", winsound.SND_FILENAME)
        print("Play:", time.perf_counter() - t3)
    except Exception as e:
        print(f"ERROR: {e}", flush=True)

# Check if arguments were passed (one-off mode)
if len(sys.argv) > 1:
    text = sys.argv[1]
    run_tts(text)
else:
    # Persistent mode (reading from stdin)
    print("READY", flush=True)
    for line in sys.stdin:
        text = line.strip()
        if text:
            run_tts(text)
            print("DONE", flush=True)