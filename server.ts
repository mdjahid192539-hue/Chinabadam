import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Chinabadam - চিনা বাদাম" });
  });

  // Optional Gemini AI endpoint for smart local guide & Islamic queries
  app.post("/api/assistant", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is missing. Please add your key in the AI Studio environment variables.",
        });
      }

      const { prompt, context } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are "চিনা বাদাম AI সহকারী" (Chinabadam Assistant) - a friendly, respectful Bengali local guide and community assistant for the social discovery app 'চিনা বাদাম' (Slogan: "অচেনা থেকে আপনজন").
Your goals:
- Reply in warm, natural Bengali (or English if prompted in English).
- Help users find local spots, mosques, sports games, travel advice, prayer times guidance, or community connection tips.
- Maintain a polite, respectful tone. Keep responses clear and formatted with markdown bullet points if helpful.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nUser Context: ${context || "General"}\nUser Query: ${prompt}` }] }
        ]
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to process request" });
    }
  });

  // Vite Dev or Production Static Serving
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🥜 Chinabadam server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
