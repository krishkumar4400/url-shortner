import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

console.log(
  "API KEY:",
  process.env.GEMINI_API_KEY ? "LOADED ✅" : "MISSING ❌",
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interaction = await ai.interactions.create({
  model: "gemini-3.1-flash-lite",
  input: "Explain how AI works in a few words",
});

console.log(interaction.output_text);
