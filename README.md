# Real-Time Urdu -> English Voice Interpreter (macOS MVP)

This is the **Phase 1 implementation**: "Translation Subtitles MVP".

It captures Urdu speech from your microphone, transcribes it locally
with faster-whisper, translates it to English (free, no API key), and
shows live Urdu + English subtitles in a desktop (Electron) window.

Voice generation (TTS) and virtual microphone routing into
Zoom/Meet/Teams are **not** part of this build - see
[`docs/architecture.md`](docs/architecture.md) for how Phase 2/3 would
slot in.

## Quick start

See [`docs/setup.md`](docs/setup.md) for full setup steps. Short
version:

```bash
# Terminal 1 - backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

# Terminal 2 - desktop app
cd electron
npm install
npm run start
```

Then click **Start Translation** in the app and speak Urdu into your
microphone.

## What's implemented

- [x] Microphone capture (16kHz mono PCM, downsampled in the renderer)
- [x] Real-time-ish streaming over WebSocket to a FastAPI backend
- [x] Local Urdu speech-to-text via **faster-whisper** (no API key,
      runs on-device)
- [x] Urdu -> English translation via **deep-translator** (free Google
      Translate backend, no API key)
- [x] Live subtitle UI (Urdu + English) with connection status and
      per-chunk latency, matching the Home / Live Translation screens
      from the original spec

## What's NOT implemented (future phases)

- [ ] Text-to-speech / English voice output (Phase 2)
- [ ] BlackHole virtual microphone routing into Zoom/Meet/Teams (Phase 3)
- [ ] Speaker profiles, transcript export, multi-language support,
      voice cloning, low-latency streaming improvements (Phase 4)

## Project structure

```text
urdu-english-interpreter/
|
+-- electron/
|   +-- package.json
|   +-- main.js
|   +-- preload.js
|   +-- src/
|       +-- index.html
|       +-- index.jsx
|       +-- App.jsx
|       +-- pages/
|       |   +-- HomeScreen.jsx
|       |   +-- LiveTranslationScreen.jsx
|       +-- components/
|       |   +-- SubtitleDisplay.jsx
|       |   +-- StatusBar.jsx
|       +-- services/
|       |   +-- websocket.js
|       |   +-- audioService.js
|       +-- styles/
|           +-- App.css
|
+-- backend/
|   +-- app.py
|   +-- requirements.txt
|   +-- services/
|   |   +-- whisper_service.py
|   |   +-- translator_service.py
|   |   +-- pipeline.py
|   +-- audio/
|   |   +-- buffer.py
|   |   +-- processor.py
|   +-- utils/
|
+-- docs/
|   +-- architecture.md
|   +-- api.md
|   +-- setup.md
|
+-- README.md
```

## Tuning

- **Latency vs accuracy**: `chunk_seconds` in
  `backend/audio/buffer.py` (default 3s).
- **Model size**: `model_size` in
  `backend/services/whisper_service.py` (default `"base"`; try `"tiny"`
  for speed or `"small"`/`"medium"` for accuracy).
