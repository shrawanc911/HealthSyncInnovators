import express from "express"
import cors from "cors"
import axios from "axios";
import getFollowUp from "./getFollowUp.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/ask", async (req, res) => {
  let { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  prompt = getFollowUp(prompt)
//   prompt = getSymptoms(prompt)

  try {
    const ollamaRes = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma3n:e2b",
        prompt, 
        stream: false,
      },
      { timeout: 300000 } // 5 minute timeout to prevent premature cancel
    );

    console.log("AI Raw Response:", ollamaRes.data); // Debugging line

    res.json({
      response: ollamaRes.data.response?.trim() || "No response from AI.",
    });
  } catch (err) {
    console.error("Ollama Error:", err.message);
    res.status(500).json({ error: "Ollama service unavailable" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
