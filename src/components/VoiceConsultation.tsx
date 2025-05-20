import React, { useState, useRef } from "react";

export function VoiceConsultation() {
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const recognitionRef = useRef<any>(null);

  const startRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      // Send to AI agent (replace with your endpoint)
      fetch("https://your-ai-endpoint/voice-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAiResponse(data.reply);
          // Speak the response
          const synth = window.speechSynthesis;
          const utter = new window.SpeechSynthesisUtterance(data.reply);
          synth.speak(utter);
        });
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4 text-pink-700">Voice Consultation</h2>
      <button
        onClick={startRecognition}
        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
      >
        🎤 Start Voice Consultation
      </button>
      {transcript && <div className="mt-2">You said: <span className="font-semibold">{transcript}</span></div>}
      {aiResponse && <div className="mt-2 text-green-700">AI: {aiResponse}</div>}
    </div>
  );
}