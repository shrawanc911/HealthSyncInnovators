import getFollowUp from "../getFollowUp.js";
import getFollowUp2 from "../getFollowUp2.js";
import getSymptoms from "../getSymptoms.js";
import getSymptomsHindi from "../getSymptomsHindi.js";
import axios from 'axios'

const getFollowUpEnglish = async (req, res) => {
  let { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  prompt = getFollowUp(prompt);
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
};

const getFollowUpHindi = async (req, res) => {
  let { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  prompt = getFollowUp2(prompt);
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
};

const generateEnglish = async(req,res) => {
    let { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });
      // prompt = getFollowUp(prompt)
      prompt = getSymptoms(prompt);
    
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
    
        // console.log("AI Raw Response:", ollamaRes.data); // Debugging line
    
        res.json({
          response: ollamaRes.data.response?.trim() || "No response from AI.",
        });
      } catch (err) {
        console.error("Ollama Error:", err.message);
        res.status(500).json({ error: "Ollama service unavailable" });
      }
};

const generateHindi = async(req,res) => {
    let { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  // prompt = getFollowUp(prompt)
  prompt = getSymptomsHindi(prompt);

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

    // console.log("AI Raw Response:", ollamaRes.data); // Debugging line

    res.json({
      response: ollamaRes.data.response?.trim() || "No response from AI.",
    });
  } catch (err) {
    console.error("Ollama Error:", err.message);
    res.status(500).json({ error: "Ollama service unavailable" });
  }
}

export { getFollowUpEnglish , getFollowUpHindi , generateEnglish , generateHindi};
