import React, { useState } from "react";

export default function Flag({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (guess: string) => void;
}) {
  const [guess, setGuess] = useState("");

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.8)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "8px",
        textAlign: "center",
        maxWidth: "400px",
        color: "black"
      }}>
        <h2>Enter the Flag</h2>
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Your flag..."
          style={{
            padding: "8px",
            width: "80%",
            marginTop: "12px",
            fontSize: "16px"
          }}
        />
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => onSubmit(guess)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#aaa",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}