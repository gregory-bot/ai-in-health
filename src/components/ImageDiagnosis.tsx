import React, { useState } from "react";

export function ImageDiagnosis() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    // Replace with your AI backend endpoint
    const response = await fetch("https://your-ai-endpoint/analyze-image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setResult(data.result); // e.g., "Possible eczema detected"
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4 text-pink-700">AI Skin Diagnosis</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!image || loading}
        className="ml-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>
      {result && <div className="mt-4 text-green-700 font-semibold">AI Result: {result}</div>}
    </div>
  );
}