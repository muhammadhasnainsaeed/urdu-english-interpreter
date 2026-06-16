import React from "react";
import SubtitleDisplay from "../components/SubtitleDisplay";
import StatusBar from "../components/StatusBar";

export default function LiveTranslationScreen({ urduText, englishText, status, latency, onStop }) {
  return (
    <div className="screen live-screen">
      <SubtitleDisplay label="Urdu" icon="\uD83C\uDFA4" text={urduText} lang="ur" />
      <SubtitleDisplay label="English" icon="\uD83C\uDF0D" text={englishText} lang="en" />

      <StatusBar status={status} latency={latency} />

      <button className="secondary-btn" onClick={onStop}>
        Stop
      </button>
    </div>
  );
}
