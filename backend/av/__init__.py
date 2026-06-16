# Stub module - satisfies faster-whisper's top-level "import av"
# without requiring the real PyAV library to be compiled.
# Safe because we only pass numpy arrays to WhisperModel.transcribe(),
# so av.open() / decode_audio() are never actually called.
