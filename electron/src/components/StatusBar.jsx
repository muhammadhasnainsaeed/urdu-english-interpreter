import React from "react";

export default function StatusBar({ status, latency }) {
  return (
    <div className="status-bar">
      <div>
        <span className="status-label">Status:</span>{" "}
        <span className={`status-value status-${status}`}>{status}</span>
      </div>
      <div>
        <span className="status-label">Latency:</span>{" "}
        <span className="status-value">{latency != null ? `${latency}s` : "\u2014"}</span>
      </div>
    </div>
  );
}
