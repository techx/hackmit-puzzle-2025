import React from "react";

export default function Rules({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "30px",
        maxWidth: "500px",
        textAlign: "left",
        color: "black",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)"
      }}>
        <h2 style={{ marginBottom: "16px", fontSize: "24px" }}>📜 Rules</h2>
        <ul style={{ lineHeight: "1.6", paddingLeft: "20px" }}>
          <li>Match <strong>3 identical tiles</strong> to clear them from the board.</li>
          <li>Your tray holds up to <strong>7 tiles</strong>. Choose carefully.</li>
          <li>If your tray fills without a match, <strong>you lose</strong>.</li>
        </ul>
        <button
          onClick={onClose}
          style={{
            marginTop: "24px",
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}