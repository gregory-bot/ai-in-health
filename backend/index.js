import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

// Simple GET route for root URL to test server
app.get("/", (req, res) => {
  res.send("Welcome to the Telecure AI Healthcare backend!");
});

const API_KEY = "4GnVeohwHDKvEcSY8gd9";
const MODEL_URL = "https://serverless.roboflow.com/skin-diseases-bkejc-98416/1";

// Route to handle image upload and forward to Roboflow
app.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    const image = fs.readFileSync(req.file.path, { encoding: "base64" });

    const response = await axios({
      method: "POST",
      url: MODEL_URL,
      params: { api_key: API_KEY },
      data: image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Remove uploaded file from server after sending
    fs.unlinkSync(req.file.path);

    res.json(response.data);
  } catch (err) {
    console.error("Error analyzing image:", err.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
