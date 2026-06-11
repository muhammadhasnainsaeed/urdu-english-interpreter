# Real-Time Urdu → English Voice Interpreter (macOS MVP)

## Project Overview

A desktop application that translates a user's spoken Urdu into English during live meetings (Zoom, Google Meet, Microsoft Teams, etc.).

The user speaks Urdu into their microphone. The application converts the speech to text, translates it into English, generates English speech, and sends the translated voice to the meeting through a virtual microphone.

The application also displays live subtitles so the user can verify translation accuracy before and during conversation.

---

# Objective

### User Flow

1. User joins a Zoom/Meet/Teams meeting.
2. User selects the Translator Virtual Microphone.
3. User speaks in Urdu.
4. Application transcribes Urdu speech.
5. Application translates Urdu → English.
6. Application displays:
   - Original Urdu text
   - English translation

7. Application generates English speech.
8. English speech is sent to meeting participants.

### Example

User says:

> السلام علیکم، آپ کیسے ہیں؟

Application displays:

Urdu:

> السلام علیکم، آپ کیسے ہیں؟

English:

> Hello, how are you?

Client hears:

> Hello, how are you?

---

# System Architecture

```text
User Microphone
        ↓
Audio Capture
        ↓
Speech-to-Text (Whisper)
        ↓
Translation Engine
        ↓
Subtitle UI
        ↓
Text-to-Speech
        ↓
Virtual Microphone
        ↓
Zoom / Meet / Teams
```

---

# Technology Stack

## Desktop Application

- Electron.js
- React.js
- Node.js

Purpose:

- Desktop UI
- Audio device management
- Communication with backend

---

## AI Backend

- Python 3.11+
- FastAPI
- WebSockets

Purpose:

- Real-time processing
- Translation pipeline

---

## Speech Recognition

### Recommended

- Faster-Whisper

Purpose:

- Urdu Speech → Urdu Text

---

## Translation Engine

### MVP

- Google Translate API

### Future Upgrade

- Meta NLLB

Purpose:

- Urdu Text → English Text

---

## Text-to-Speech

### Recommended

- ElevenLabs

### Alternative

- OpenAI TTS
- macOS Native Speech

Purpose:

- English Text → English Voice

---

## Audio Routing

### macOS

- BlackHole 2ch

Purpose:

- Virtual microphone output

---

# Software Requirements

## Development Environment

### Required

- macOS 13+
- Node.js 22+
- Python 3.11+
- Homebrew
- Git

### IDE

- Cursor
- VS Code
- Zed

---

# Installation Requirements

## Install BlackHole

```bash
brew install blackhole-2ch
```

## Install Node Dependencies

```bash
npm install
```

## Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# Project Structure

```bash
urdu-english-interpreter/
│
├── electron/
│   ├── package.json
│   ├── main.js
│   ├── preload.js
│   │
│   └── src/
│       ├── App.jsx
│       ├── pages/
│       ├── components/
│       │
│       ├── services/
│       │   ├── websocket.js
│       │   ├── audioService.js
│       │   └── translationService.js
│       │
│       └── styles/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   │
│   ├── services/
│   │   ├── whisper_service.py
│   │   ├── translator_service.py
│   │   ├── tts_service.py
│   │   └── pipeline.py
│   │
│   ├── audio/
│   │   ├── processor.py
│   │   └── buffer.py
│   │
│   └── utils/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── setup.md
│
└── README.md
```

---

# Development Phases

## Phase 1 — Translation Subtitles MVP

Goal:

Convert Urdu speech into English subtitles.

### Features

- Microphone input
- Whisper transcription
- Translation
- Live subtitle display

### Output

```text
Urdu:
میں آپ سے بعد میں رابطہ کروں گا

English:
I will contact you later.
```

---

## Phase 2 — Voice Generation

Goal:

Generate English speech from translated text.

### Features

- TTS integration
- Audio playback

---

## Phase 3 — Virtual Microphone Integration

Goal:

Send translated English voice into Zoom/Meet.

### Features

- BlackHole integration
- Virtual microphone routing

---

## Phase 4 — Production Improvements

### Features

- Speaker profiles
- Translation history
- Meeting transcript export
- Multiple languages
- Voice cloning
- Low-latency streaming

---

# Backend Processing Flow

```text
Audio Chunk
      ↓
Whisper
      ↓
Urdu Text
      ↓
Translator
      ↓
English Text
      ↓
Subtitle Update
      ↓
TTS
      ↓
Audio Output
```

---

# UI Screens

## Home Screen

```text
---------------------------------

 Urdu → English Interpreter

 Input Language:
 [ Urdu ]

 Output Language:
 [ English ]

 [ Start Translation ]

---------------------------------
```

## Live Translation Screen

```text
---------------------------------

🎤 Urdu

السلام علیکم آپ کیسے ہیں

---------------------------------

🌍 English

Hello, how are you?

---------------------------------

Status:
Connected

Latency:
1.2s

---------------------------------
```

---

# MVP Success Criteria

The MVP is considered successful when:

- User speaks Urdu
- Urdu text appears on screen
- English translation appears on screen
- Translation latency remains below 2 seconds
- Meeting participants hear translated English through virtual microphone

---

# Future Roadmap

## Version 2

- English → Urdu
- Urdu → Arabic
- Urdu → Hindi

## Version 3

- Voice cloning
- AI meeting assistant
- Meeting summaries
- CRM integration

## Version 4

- SaaS version
- Team accounts
- Cloud processing
- Enterprise deployment

---

# Recommended Build Order

1. Electron application setup
2. FastAPI backend setup
3. Microphone capture
4. Whisper integration
5. Translation integration
6. Subtitle UI
7. TTS integration
8. BlackHole routing
9. Latency optimization
10. Production packaging
