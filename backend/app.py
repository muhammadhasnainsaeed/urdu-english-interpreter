import asyncio
import json
import logging
from contextlib import asynccontextmanager
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.middleware.cors import CORSMiddleware

from services.pipeline import TranslationPipeline
from services.translator_service import TranslatorService
from services.whisper_service import WhisperService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("interpreter")

whisper_service = None
translator_service = None
executor = ThreadPoolExecutor(max_workers=1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global whisper_service, translator_service
    logger.info("Loading Whisper model...")
    whisper_service = WhisperService(model_size="tiny")
    translator_service = TranslatorService(source="ur", target="en")
    logger.info("Models loaded. Ready for connections.")
    yield


app = FastAPI(title="Urdu-English Interpreter Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.websocket("/ws/translate")
async def websocket_translate(websocket: WebSocket):
    await websocket.accept()
    logger.info("Client connected")

    pipeline = TranslationPipeline(whisper_service, translator_service)
    await websocket.send_text(json.dumps({"type": "status", "status": "connected"}))

    try:
        while True:
            message = await websocket.receive()

            # Client disconnected cleanly
            if message["type"] == "websocket.disconnect":
                logger.info("Client disconnected")
                break

            if message.get("bytes") is not None:
                pipeline.add_audio(message["bytes"])
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(executor, pipeline.process_if_ready)
                if result:
                    logger.info(f"[TIMING] whisper+translate total={result['latency']}s  urdu='{result['urdu']}'")
                    await websocket.send_text(json.dumps({"type": "translation", **result}))

            elif message.get("text") is not None:
                try:
                    payload = json.loads(message["text"])
                    if payload.get("type") == "reset":
                        pipeline.reset()
                except json.JSONDecodeError:
                    pass

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
