import React from "react";

export default function SubtitleDisplay({ label, icon, text, lang }) {
  return (
    <div className={`subtitle-box subtitle-${lang}`} dir={lang === "ur" ? "rtl" : "ltr"}>
      <div className="subtitle-label">
        <span className="subtitle-icon">{icon}</span> {label}
      </div>
      <div className="subtitle-text">{text || "\u2026"}</div>
    </div>
  );
}
