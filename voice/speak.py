import sys
import soundfile as sf
from kokoro_onnx import Kokoro
from pathlib import Path

text = sys.argv[1]

BASE_DIR = Path(__file__).resolve().parent

kokoro = Kokoro(
    f"{BASE_DIR}/models/kokoro-v1.0.int8.onnx",
    f"{BASE_DIR}/voices/voices-v1.0.bin"
)

try:
    samples, sample_rate = kokoro.create(
        text,
        voice="am_adam",
        speed=1.0,
        lang="en-us"
    )
except Exception as e:
    print("TEXT:", repr(text))
    print("ERROR:", repr(e))
    raise

sf.write("output.wav", samples, sample_rate)