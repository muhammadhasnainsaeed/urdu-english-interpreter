import React, { useRef, useState } from "react";
import HomeScreen from "./pages/HomeScreen";
import LiveTranslationScreen from "./pages/LiveTranslationScreen";
import { AudioService } from "./services/audioService";
import { TranslationSocket } from "./services/websocket";

const WS_URL = "ws://localhost:8000/ws/translate";

export default function App() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [status, setStatus] = useState("disconnected");
  const [urduText, setUrduText] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const audioRef = useRef(null);

  const handleStart = async () => {
    setError(null);

    try {
      const socket = new TranslationSocket({
        url: WS_URL,
        onStatusChange: setStatus,
        onMessage: (data) => {
          if (data.type === "translation") {
            setUrduText(data.urdu);
            setEnglishText(data.english);
            setLatency(data.latency);
          } else if (data.type === "status") {
            setStatus(data.status);
          }
        },
      });
      socket.connect();
      socketRef.current = socket;

      const audio = new AudioService((chunk) => {
        socketRef.current?.sendAudio(chunk);
      });
      await audio.start();
      audioRef.current = audio;

      setUrduText("");
      setEnglishText("");
      setLatency(null);
      setIsTranslating(true);
    } catch (err) {
      console.error(err);
      setError(
        "Could not access the microphone or reach the backend. Check mic permissions and that the backend is running on localhost:8000.",
      );
      handleStop();
    }
  };

  const handleStop = () => {
    audioRef.current?.stop();
    audioRef.current = null;

    socketRef.current?.close();
    socketRef.current = null;

    setIsTranslating(false);
    setStatus("disconnected");
  };

  if (isTranslating) {
    return (
      <LiveTranslationScreen
        urduText={urduText}
        englishText={englishText}
        status={status}
        latency={latency}
        onStop={handleStop}
      />
    );
  }

  return <HomeScreen onStart={handleStart} error={error} />;
}
