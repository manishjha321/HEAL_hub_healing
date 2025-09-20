const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load .env vars

// For Node < 18
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

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
                model: "deepseek/deepseek-chat", // or check OpenRouter for exact model
                messages: [
                    {
                        role: "system",
                        content: "You are a mental wellness chatbot named Saksham. You provide supportive and non-judgmental responses."
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

app.listen(port, () => {
    console.log(`Saksham backend running on port ${port}`);
});
