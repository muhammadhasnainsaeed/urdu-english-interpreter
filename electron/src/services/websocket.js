/**
 * Thin wrapper around the WebSocket connection to the FastAPI backend.
 *
 * Sends raw PCM16 audio chunks as binary frames and receives JSON
 * messages with transcription/translation results or status updates.
 */
export class TranslationSocket {
  constructor({ url, onMessage, onStatusChange }) {
    this.url = url;
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
    this.ws = null;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => this.onStatusChange?.("connected");
    this.ws.onclose = () => this.onStatusChange?.("disconnected");
    this.ws.onerror = () => this.onStatusChange?.("error");

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage?.(data);
      } catch (err) {
        // Ignore malformed/non-JSON messages.
      }
    };
  }

  sendAudio(buffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(buffer);
    }
  }

  reset() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "reset" }));
    }
  }

  close() {
    this.ws?.close();
    this.ws = null;
  }
}
