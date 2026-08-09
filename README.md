# J.A.R.V.I.S.

J.A.R.V.I.S. (Just A Reliable Virtual Intelligence System) adalah AI assistant lokal berbasis Node.js dan Python. Project ini menggabungkan percakapan suara, local LLM, memory, tool calling, dan pemahaman source code proyek.

## Kemampuan saat ini

- Voice pipeline: Whisper STT -> local LLM -> Kokoro ONNX TTS.
- Percakapan keyboard dan voice dengan conversation history.
- Long-term memory.
- Tool untuk file/folder, command, pencarian, dan Excel.
- Local LLM melalui endpoint OpenAI-compatible di `config.js`.
- Project understanding memakai Graphify sebagai retrieval engine.

## Project understanding dengan Graphify

Graphify menghasilkan `graphify-out/graph.json` dari source code. File graph itu tidak dikirim ke LLM. Sebagai gantinya, Jarvis melakukan alur berikut:

```text
@project <pertanyaan source code>
  -> Project Handler
  -> Project Agent
  -> Graphify retrieval
  -> file source yang relevan saja
  -> Local LLM
  -> jawaban beserta sumber context
```

Untuk pertanyaan lokasi simbol, Jarvis menjawab langsung dari graph tanpa memanggil LLM. Contoh:

```text
@project di mana saya pakai chalk?
@project askLLM dipakai di mana saja?
```

Untuk pertanyaan penjelasan, LLM hanya menerima maksimal empat file relevan. Setiap file dibatasi hingga 6.000 karakter.

## Struktur Project Agent

```text
handlers/projectHandle.js     Command entry point dan status spinner
agent/projectAgent.js         Orkestrasi jawaban project
tools/projectRetriever.js     Query Graphify dan pemilihan file
tools/projectContext.js       Validasi path dan pembacaan context
graph-agent.js                API/CLI graph Graphify
```

## Menjalankan Graphify

Jalankan ulang graph setiap source code berubah:

```bash
python -m uv tool run --from graphifyy graphify . --code-only
```

Hasil yang dipakai Jarvis adalah `graphify-out/graph.json`.

Anda juga dapat menguji Graph Agent dari CLI:

```bash
node graph-agent.js initTTS
node graph-agent.js --related askLLM
node graph-agent.js --community askLLM
```

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `@project <pertanyaan>` | Memahami source code melalui Graphify |
| `@tools <perintah>` | Operasi file, folder, dan command |
| `@workspace <pertanyaan>` | Membaca workspace memory/context lama |
| `@excel <perintah>` | Membaca atau mengubah Excel |
| `@search <query>` | Pencarian informasi |
| `@image` / `@music` | Content router |

## Arsitektur

```text
Keyboard / Voice
  -> index.js
  -> promptHendler.js
  -> handler spesifik
  -> agent
  -> tools / local LLM
  -> text dan Kokoro TTS
```

## Instalasi dari clone baru (Windows)

Prasyarat:

- Node.js 20 LTS atau lebih baru.
- Python 3.10+ dengan **Python Launcher** (`py`).
- Local LLM yang menyediakan endpoint OpenAI-compatible, misalnya LM Studio.

Clone repo lalu jalankan:

```powershell
.\setup.ps1
```

Script tersebut memasang dependency Node.js, membuat virtual environment `.venv`, memasang dependency Python dari `requirements.txt`, dan membuat `.env` dari `.env.example` bila belum ada. TTS otomatis memprioritaskan Python dari `.venv`.

Untuk sekaligus membuat ulang index source code Graphify:

```powershell
.\setup.ps1 -GenerateGraph
```

Model dan runtime berukuran besar tidak disimpan di Git. Salin atau unduh komponen berikut ke lokasi ini:

| Komponen | Lokasi yang diperlukan |
| --- | --- |
| Whisper runtime | `whisper/whisper-stream.exe` |
| Whisper model | `whisper/models/ggml-small.bin` |
| Kokoro model | `voice/models/kokoro-v1.0.fp16-gpu.onnx` |
| Kokoro voice pack | `voice/voices/voices-v1.0.bin` |

Periksa instalasi kapan saja:

```bash
npm run doctor
```

Atur endpoint/model local LLM di `config.js`. Tambahkan API key Tavily atau Pexels ke `.env` hanya jika ingin memakai `@search` atau `@image`.

Jalankan Jarvis setelah doctor selesai tanpa error:

```bash
npm start
```

## Roadmap

- Intent detection otomatis untuk pertanyaan source code tanpa prefix `@project`.
- Memory yang dipisahkan menjadi conversation, long-term, dan project memory.
- Tool router dengan approval untuk aksi berisiko.
- Voice realtime dengan interrupt/barge-in.
- Vision, browser integration, dan autonomous task loop.

## Tech stack

- Node.js
- Python
- Local OpenAI-compatible LLM
- Whisper
- Kokoro ONNX
- Graphify
- ExcelJS
