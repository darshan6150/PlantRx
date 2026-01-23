import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY });

export async function geminiWrite(systemPrompt, userPrompt, model = "gemini-2.5-flash") {
  try {
    const response = await genAI.models.generateContent({
      model,
      contents: `${systemPrompt}\n\n${userPrompt}`,
    });
    return response.text || "";
  } catch (error) {
    console.log("Gemini API error, using fallback:", error.message);
    return "";
  }
}