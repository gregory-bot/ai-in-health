import React, { useState, useRef } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";

export function ImageDiagnosis() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResult(null);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);  // <-- key changed to "image" to match backend

    try {
      const response = await fetch("http://localhost:5000/analyze-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      // Show the top prediction and confidence percentage
      setResult(`${data.top} (${(data.confidence * 100).toFixed(2)}%)`);
    } catch (err) {
      setResult("Error analyzing image. Please try again.");
    }
    setLoading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto my-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-pink-700 text-center">AI Skin Diagnosis</h2>
      <div
        className={`w-40 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition hover:border-pink-500 bg-gray-50 mb-4 ${
          preview ? "border-pink-500" : "border-gray-300"
        }`}
        onClick={handleUploadClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="w-10 h-10 text-pink-400 mb-2" />
            <span className="text-gray-500 text-sm">Tap to upload image</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {image && (
        <div className="mb-4 text-gray-700 text-sm text-center">
          <span className="font-medium">Selected:</span> {image.name}
        </div>
      )}
      <button
        onClick={handleAnalyze}
        disabled={!image || loading}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-60 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Analyzing...
          </>
        ) : (
          "Analyze Image"
        )}
      </button>
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium text-center shadow">
          {result}
        </div>
      )}
    </div>
  );
}
