"""
Translation service for Urdu -> English.

Uses deep-translator's GoogleTranslator backend, which calls Google's
public translate endpoint and does NOT require an API key or billing.

Note: this depends on an internet connection and is fine for an MVP,
but is rate-limited and unofficial. The "Future Upgrade" path in the
README (Meta NLLB, run locally) can replace this module later without
changing the rest of the pipeline.
"""

from deep_translator import GoogleTranslator


class TranslatorService:
    def __init__(self, source: str = "ur", target: str = "en"):
        self.source = source
        self.target = target
        self._translator = GoogleTranslator(source=source, target=target)

    def translate(self, text: str) -> str:
        text = (text or "").strip()
        if not text:
            return ""

        try:
            return self._translator.translate(text)
        except Exception as exc:  # pragma: no cover - network/translation errors
            print(f"[TranslatorService] translation failed: {exc}")
            return ""
