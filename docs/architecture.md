# Architecture - Phase 1 (Translation Subtitles MVP)

## Goal

Convert spoken Urdu (captured from the user's microphone) into live
Urdu + English subtitles in the desktop app, with end-to-end latency
under ~2 seconds. No voice output or virtual microphone yet - those
are Phase 2 and Phase 3.

## Data flow

```text
Microphone (Electron renderer)
    |  getUserMedia()
    v
AudioService
    |  downsample to 16kHz mono, convert to PCM16
    v
WebSocket (binary frames) ----> FastAPI /ws/translate
                                      |
                                      v
                                AudioBuffer
                                  (accumulates ~3s of audio)
                                      |
                                      v
                                WhisperService (faster-whisper, local)
                                  Urdu speech -> Urdu text
                                      |
                                      v
                                TranslatorService (deep-translator)
                                  Urdu text -> English text
                                      |
                                      v
WebSocket (JSON) <-------------------+
    |
    v
React UI (SubtitleDisplay x2 + StatusBar)
```

## Why chunk-based processing?

True streaming ASR is complex to get right for an MVP. Instead, the
backend buffers ~3 seconds of audio at a time, checks it isn't silence
(simple RMS energy check), then runs Whisper with its built-in VAD
filter on that chunk. This keeps the implementation simple while still
feeling close to real-time.

`chunk_seconds` in `backend/audio/buffer.py` is the main latency/accuracy
knob:
- Smaller (e.g. 2s) -> lower latency, but Whisper has less context and
  may mis-transcribe sentence fragments.
- Larger (e.g. 4-5s) -> more accurate transcriptions, higher latency.

## Key modules

- `backend/app.py` - FastAPI app + WebSocket endpoint. Loads the
  Whisper model and translator once at startup and shares them across
  connections.
- `backend/audio/buffer.py` - accumulates raw PCM16 bytes into
  fixed-size float32 chunks.
- `backend/audio/processor.py` - silence/VAD energy check.
- `backend/services/whisper_service.py` - wraps faster-whisper.
- `backend/services/translator_service.py` - wraps deep-translator
  (free Google Translate, no API key).
- `backend/services/pipeline.py` - orchestrates the above per
  connection.
- `electron/src/services/audioService.js` - mic capture + downsampling
  in the renderer.
- `electron/src/services/websocket.js` - WebSocket client.
- `electron/src/App.jsx` - wires everything together and switches
  between the Home and Live Translation screens.

## Upgrade paths (later phases)

- **TTS (Phase 2)**: add a `tts_service.py` that takes the English text
  from the pipeline result and synthesizes speech (ElevenLabs / OpenAI
  TTS / macOS `say`).
- **Virtual mic (Phase 3)**: route the synthesized audio to BlackHole
  so Zoom/Meet/Teams pick it up as the microphone input.
- **Better translation**: swap `TranslatorService` for a local NLLB
  model without changing `pipeline.py`'s interface.
