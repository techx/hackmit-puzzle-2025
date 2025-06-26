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
        color: "#1b1421",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)"
      }}>
        <h2 style={{ marginBottom: "16px", fontSize: "28px", fontWeight: "bold", color: "#1b1421" }}>
        Welcome to the Puzzle District
        </h2>
        <p style={{ fontSize: "18px", marginBottom: "12px" }}>
        A city lit by logic. Stack smart, match quick, and keep the streets from overflowing.
        </p>
        <ul style={{ lineHeight: "1.8", paddingLeft: "24px", fontSize: "16px" }}>
        <li>🔲 Match <strong>3 identical tiles</strong> to clear them from the board.</li>
        <li>📥 Your tray holds up to <strong>7 tiles</strong>. Manage your space wisely.</li>
        <li>💥 If your tray fills without a match, <strong>it's game over</strong>.</li>
        </ul>
        <p style={{ fontSize: "16px", marginTop: "12px", fontStyle: "italic" }}>
        Think ahead. Keep moving. There's more to this place than meets the eye.
        </p>
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