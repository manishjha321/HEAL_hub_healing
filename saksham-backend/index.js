const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load .env vars

// For Node < 18
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// -------------------
// Saksham AI Chatbot Route (unchanged)
// -------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a mental wellness chatbot named Saksham. You provide supportive and non-judgmental responses. You were created by the developers at HealHub, with Manish Jha as Head of Tech."
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";

    res.json({ message: botMessage });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    res.status(500).json({ message: "An error occurred with the chatbot." });
  }
});

// -------------------
// Diary Sentiment Analysis Route (unchanged)
// -------------------
app.post('/api/analyze-diary', async (req, res) => {
  try {
    const { diaryText } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DIARY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nousresearch/deephermes-3-mistral-24b-preview",
        messages: [
          {
            role: "system",
            content: `
You are a compassionate diary analysis assistant working for HealHub. Your role is to read and understand diary entries written by users and respond with empathy, emotional awareness, and helpful guidance.

If the user expresses suicidal thoughts — directly or indirectly — respond with deep care. Share this Indian helpline: 9152987821 (iCall). Remind them that HealHub is with them, and gently encourage them to visit the Community section for support.

If the user is happy, respond with warmth, celebration, and encouragement.

If the user is sad, offer motivation, emotional support, and remind them they are not alone.

If the diary entry feels boring or uninspired, suggest they check out the Resources section for uplifting books, music, or activities.

If the user seems confused or asks a question, do your best to answer clearly or guide them toward helpful actions.

Always be kind, non-judgmental, and emotionally intelligent. Keep your response short, supportive, and human-like.
            `
          },
          {
            role: "user",
            content: `Diary entry: "${diaryText}"`
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("Diary AI response:", JSON.stringify(data, null, 2));

    const analysis = data.choices?.[0]?.message?.content;
    if (!analysis) {
      console.error("Missing AI response:", data);
      return res.json({ analysis: "AI couldn't analyze your entry. Please try again or rephrase it." });
    }

    res.json({ analysis });
  } catch (error) {
    console.error("Diary analysis error:", error);
    res.status(500).json({ analysis: "AI analysis failed. Please try again later." });
  }
});

// -------------------
// ✅ Weekly Insight Route (new POST version)
// -------------------
app.post('/api/weekly-insight', async (req, res) => {
  try {
    const { entries } = req.body;

    if (!entries || entries.length === 0) {
      return res.status(400).json({ insight: "No diary entries found to analyze." });
    }

    // Merge the last 5 entries into one text block
    const diaryText = entries
      .map(e => `(${e.date}) ${e.title}: ${e.entry}`)
      .join("\n\n");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DIARY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nousresearch/deephermes-3-mistral-24b-preview",
        messages: [
          {
            role: "system",
            content: `
You are a compassionate diary analysis assistant working for HealHub. 

Your task:
1. Analyze the user's last 5 diary entries.
2. Identify reasons for sadness, stress, or anxiety if present.
3. Gently highlight patterns, mistakes, or emotional challenges.
4. Provide actionable, empathetic coping advice.
5. Celebrate positivity if entries are happy or motivational.
6. Remind the user HealHub is always with them.
7. Keep the tone human-like, supportive, and concise.

Format:
- First, describe observed problems or emotional state.
- Then, suggest solutions and coping strategies.
            `
          },
          {
            role: "user",
            content: `Here are the last 5 diary entries:\n${diaryText}`
          }
        ]
      }),
    });

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content ||
      "AI couldn't generate an insight this time. Please try again later.";

    res.json({ insight });
  } catch (error) {
    console.error("Weekly insight error:", error);
    res.status(500).json({ insight: "Error generating insight." });
  }
});

// -------------------
app.listen(port, () => {
  console.log(`Saksham backend running on port ${port}`);
});
