import React from "react";

export default function HomeScreen({ onStart, error }) {
  return (
    <div className="screen home-screen">
      <h1>Urdu &rarr; English Interpreter</h1>

      <div className="field">
        <label>Input Language</label>
        <div className="pill">Urdu</div>
      </div>

      <div className="field">
        <label>Output Language</label>
        <div className="pill">English</div>
      </div>

      <button className="primary-btn" onClick={onStart}>
        Start Translation
      </button>

      {error && <p className="error-text">{error}</p>}

      <p className="hint">
        Make sure the backend server is running on <code>localhost:8000</code> and
        grant microphone access when prompted.
      </p>
    </div>
  );
}
