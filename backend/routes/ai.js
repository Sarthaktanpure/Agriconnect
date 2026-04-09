const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── AI CHATBOT ──────────────────────────────────────────────
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are AgriBot, a helpful assistant for AgriConnect — a platform 
      that connects farmers directly with buyers in India. Help users with: 
      crop pricing advice, selling tips, best seasons to sell, how to write 
      good listings, negotiation tips, and general farming/agriculture questions. 
      Keep answers concise, practical, and friendly. If asked something unrelated 
      to agriculture or the platform, politely redirect.`,
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

// ── PRICE PREDICTION ────────────────────────────────────────
router.post("/predict-price", async (req, res) => {
  const { cropName, quantity, unit, location, season } = req.body;
  if (!cropName) return res.status(400).json({ error: "Crop name is required" });

  try {
    const prompt = `You are an agricultural price prediction expert for Indian markets.

A farmer wants to sell:
- Crop: ${cropName}
- Quantity: ${quantity || "not specified"} ${unit || ""}
- Location: ${location || "India"}
- Season: ${season || "current season"}

Give a price prediction in this EXACT JSON format only, no extra text:
{
  "minPrice": <number in INR per kg>,
  "maxPrice": <number in INR per kg>,
  "recommendedPrice": <number in INR per kg>,
  "confidence": "<Low | Medium | High>",
  "reasoning": "<2-3 sentences explaining the price range>",
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content[0].text.trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error("Predict error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;