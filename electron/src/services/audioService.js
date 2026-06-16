/**
 * Captures microphone audio and emits 16kHz, mono, 16-bit PCM chunks
 * suitable for streaming to the Whisper backend over a WebSocket.
 */
export class AudioService {
  constructor(onChunk) {
    this.onChunk = onChunk;
    this.audioContext = null;
    this.source = null;
    this.processor = null;
    this.stream = null;
    this.targetSampleRate = 16000;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    this.source = this.audioContext.createMediaStreamSource(this.stream);

    // ScriptProcessorNode is deprecated but still broadly supported in
    // Electron/Chromium and is the simplest cross-version option for
    // an MVP. Buffer size of 4096 gives a good latency/CPU tradeoff.
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const downsampled = this._downsample(
        input,
        this.audioContext.sampleRate,
        this.targetSampleRate
      );
      const pcm16 = this._floatTo16BitPCM(downsampled);
      this.onChunk(pcm16);
    };

    this.source.connect(this.processor);
    // Connecting to destination is required by some browsers for the
    // processor to run, even though we don't want to play audio back.
    this.processor.connect(this.audioContext.destination);
  }

  stop() {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.audioContext?.close();

    this.processor = null;
    this.source = null;
    this.stream = null;
    this.audioContext = null;
  }

  _downsample(buffer, inputRate, outputRate) {
    if (outputRate === inputRate) return buffer;

    const ratio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      result[i] = buffer[Math.floor(i * ratio)];
    }

    return result;
  }

  _floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;

    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    }

    return buffer;
  }
}
