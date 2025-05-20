import React, { useState } from "react";
import { askMedicalQuestion } from "../api/openaiService";

const MedicalBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return; // Prevent empty asks
    try {
      const answer = await askMedicalQuestion(question);
      setResponse(answer);
      setQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
      setResponse("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Toggle Button on Bottom-Left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "1.5rem",
          backgroundColor: "#10b981",
          color: "white",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          zIndex: 3000, // Ensured it’s above other content
        }}
        aria-label="Toggle Medical Chatbot"
      >
        🏥
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "5.5rem",
            left: "1.5rem",
            width: "300px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            padding: "1rem",
            zIndex: 2000,
          }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>TeleCure AI Assistant</h3>

          <textarea
            placeholder="Ask a health question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              borderRadius: "6px",
              padding: "0.5rem",
              border: "1px solid #ccc",
              resize: "none",
              marginBottom: "0.5rem",
            }}
          />

          <button
            onClick={handleAsk}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Ask
          </button>

          {response && (
            <div style={{ marginTop: "0.75rem", whiteSpace: "pre-wrap" }}>
              <strong>AI:</strong>
              <p>{response}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MedicalBot;
