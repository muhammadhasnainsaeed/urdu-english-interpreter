# API Reference - Phase 1

## REST

### `GET /health`

Simple liveness check.

**Response**

```json
{ "status": "ok" }
```

## WebSocket

### `ws://localhost:8000/ws/translate`

Bidirectional connection used for streaming audio and receiving
translation results.

#### Client -> Server

**Binary frames**

Raw PCM16, mono, 16kHz audio samples (little-endian). Sent continuously
while the user is recording. The frontend's `AudioService` produces
these automatically.

**Text frames (JSON)**

```json
{ "type": "reset" }
```

Clears the server-side audio buffer for this connection (e.g. when the
user wants to discard whatever partial audio is currently buffered).

#### Server -> Client

All server messages are JSON text frames with a `type` field.

**Status update**

```json
{ "type": "status", "status": "connected" }
```

**Translation result**

Sent whenever a buffered chunk of audio produced a non-empty
transcription:

```json
{
  "type": "translation",
  "urdu": "\u0633\u0644\u0627\u0645 \u0627\u0644\u06cc\u06a9\u0645\u060c \u0622\u067e \u06a9\u06cc\u0633\u06d2 \u06c1\u06cc\u06ba\u061f",
  "english": "Hello, how are you?",
  "latency": 1.2
}
```

- `urdu`: raw Whisper transcription of the most recent audio chunk.
- `english`: translation of `urdu`.
- `latency`: seconds taken to transcribe + translate that chunk
  (displayed in the UI's status bar).

If a chunk is silent or produces no transcription, no message is sent
for that chunk.
