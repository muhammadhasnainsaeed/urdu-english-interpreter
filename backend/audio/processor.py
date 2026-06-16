"""
Small helpers for working with raw audio buffers.
"""

import numpy as np


def is_silent(audio: np.ndarray, threshold: float = 0.01) -> bool:
    """
    Returns True if the audio chunk's RMS energy is below `threshold`,
    i.e. the user probably wasn't speaking. Used to avoid sending empty
    audio to Whisper/translation on every cycle.
    """
    if audio.size == 0:
        return True

    rms = float(np.sqrt(np.mean(np.square(audio))))
    return rms < threshold
