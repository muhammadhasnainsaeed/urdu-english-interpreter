import numpy as np
from faster_whisper import WhisperModel


class WhisperService:
    def __init__(
        self, model_size: str = "tiny", device: str = "cpu", compute_type: str = "int8"
    ):
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)

    def transcribe(self, audio: np.ndarray, language: str = "ur") -> str:
        if audio.size == 0:
            return ""

        segments, _info = self.model.transcribe(
            audio,
            language=language,
            task="transcribe",
            vad_filter=False,  # disabled — was downloading Silero VAD model on every request
            beam_size=1,
            best_of=1,
            temperature=0.0,
        )

        return "".join(segment.text for segment in segments).strip()
