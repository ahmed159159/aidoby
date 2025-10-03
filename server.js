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

// Frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// API Endpoint
app.post("/api/query", async (req, res) => {
  try {
    const { question, lat, lon } = req.body;

    // 1️⃣ تحليل السؤال → كلمة مفتاحية
    const analysis = await askDobby(`استخرج كلمة بحث واحدة من السؤال التالي: ${question}`);

    // 2️⃣ البحث في Foursquare
    const results = await searchPlaces(analysis, lat, lon);

    // 3️⃣ إعادة صياغة النتيجة
    const formatted = await askDobby(`
      هذه نتائج بحث من Foursquare: ${JSON.stringify(results)} 
      رجاءً أعرضها للمستخدم كقائمة أماكن مع العناوين بالعربية إن أمكن.
    `);

    res.json({ query: question, analysis, results, formatted });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
