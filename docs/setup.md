# Setup Guide - Phase 1 (Translation Subtitles MVP)

## Prerequisites

- macOS 13+
- Node.js 22+
- Python 3.11+
- Homebrew, Git

> BlackHole is **not** needed for Phase 1 (it's only used in Phase 3
> for virtual microphone routing).

## 1. Backend (FastAPI + faster-whisper)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

On first run, faster-whisper will download the `base` model
automatically (a few hundred MB). Subsequent runs use the cached
model and start much faster.

Verify it's running:

```bash
curl http://localhost:8000/health
# -> {"status":"ok"}
```

## 2. Electron app (React + esbuild)

In a separate terminal:

```bash
cd electron
npm install
npm run start
```

This builds the React bundle with esbuild and launches the Electron
window.

## 3. Using the app

1. Make sure the backend (step 1) is running.
2. In the Electron window, click **Start Translation**.
3. Grant microphone permission when prompted.
4. Speak in Urdu - within a few seconds you should see the Urdu text
   and English translation appear, along with connection status and
   latency.
5. Click **Stop** to end the session.

## Troubleshooting

- **"Could not access the microphone or reach the backend"**: check
  System Settings -> Privacy & Security -> Microphone, and confirm the
  backend is running on `localhost:8000`.
- **Nothing appears after speaking**: the backend buffers ~3 seconds of
  audio before transcribing (see `backend/audio/buffer.py`). Speak in
  full short sentences and wait a moment.
- **Translation requests fail / empty English text**: `deep-translator`
  calls Google's public translate endpoint and needs an active internet
  connection. If you hit rate limits, wait a bit or switch
  `TranslatorService` to a local model later.
- **Slow transcription**: try a smaller Whisper model
  (`model_size="tiny"` in `backend/services/whisper_service.py`), or a
  larger one (`"small"`/`"medium"`) for better accuracy if your Mac can
  handle it.
