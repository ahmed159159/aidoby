import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js";
import { searchPlaces } from "./services/foursquare.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Frontend static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// ✅ API Endpoint
app.post("/api/query", async (req, res) => {
  try {
    const { question } = req.body;

    // 1- تحليل السؤال مع Dobby
    const analysis = await askDobby(question);

    // 2- البحث في Foursquare
    const results = await searchPlaces(analysis);

    res.json({ analysis, results });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Railway port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
