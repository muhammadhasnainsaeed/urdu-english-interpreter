"""
Per-connection pipeline that ties together:

    audio chunk -> AudioBuffer -> Whisper (Urdu STT) -> Translator (Urdu -> English)

Each WebSocket connection gets its own AudioBuffer (so multiple users
don't mix audio) but shares the same (heavy) Whisper model and
translator instances for efficiency.
"""

import time

from audio.buffer import AudioBuffer
from audio.processor import is_silent
from services.whisper_service import WhisperService
from services.translator_service import TranslatorService


class TranslationPipeline:
    def __init__(self, whisper: WhisperService, translator: TranslatorService):
        self.whisper = whisper
        self.translator = translator
        self.audio_buffer = AudioBuffer()

    def add_audio(self, data: bytes) -> None:
        self.audio_buffer.add(data)

    def process_if_ready(self):
        """
        If enough audio has been buffered, run STT + translation.

        Returns a dict with `urdu`, `english`, and `latency` keys, or
        None if there's nothing new to report yet (not enough audio,
        silence, or no speech detected).
        """
        if not self.audio_buffer.ready():
            return None

        start = time.time()
        audio = self.audio_buffer.pop_chunk()

        if is_silent(audio):
            return None

        urdu_text = self.whisper.transcribe(audio, language="ur")
        if not urdu_text:
            return None

        english_text = self.translator.translate(urdu_text)
        latency = round(time.time() - start, 2)

        return {
            "urdu": urdu_text,
            "english": english_text,
            "latency": latency,
        }

    def reset(self) -> None:
        self.audio_buffer.reset()
