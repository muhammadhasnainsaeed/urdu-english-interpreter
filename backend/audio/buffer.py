import numpy as np


class AudioBuffer:
    def __init__(self, sample_rate: int = 16000, chunk_seconds: float = 1.5):
        self.sample_rate = sample_rate
        self.chunk_seconds = chunk_seconds
        self.chunk_size_bytes = int(sample_rate * chunk_seconds * 2)
        self._buffer = bytearray()

    def add(self, data: bytes) -> None:
        self._buffer.extend(data)

    def ready(self) -> bool:
        return len(self._buffer) >= self.chunk_size_bytes

    def pop_chunk(self) -> np.ndarray:
        chunk_bytes = bytes(self._buffer[: self.chunk_size_bytes])
        del self._buffer[: self.chunk_size_bytes]
        audio_int16 = np.frombuffer(chunk_bytes, dtype=np.int16)
        return audio_int16.astype(np.float32) / 32768.0

    def reset(self) -> None:
        self._buffer = bytearray()
