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

    console.log("🟢 Incoming request:", { question, lat, lon });

    if (!lat || !lon) {
      return res.status(400).json({ error: "❌ Location (lat, lon) is required" });
    }

    // 🧠 خلي Dooby يحلل السؤال
    const analysis = await askDobby(`
      السؤال: "${question}"
      مطلوب منك تحديد نوع المكان المناسب للبحث في Foursquare.
      إذا كان السؤال عن "مطعم سمك" → رجّع "seafood".
      إذا كان "بيتزا" → رجّع "pizza".
      إذا كان "كافيه" → رجّع "coffee shop".
      إذا لم تفهم → رجّع "restaurant".
      رجّع كلمة واحدة فقط: نوع البحث المناسب.
    `);

    const query = (analysis || "restaurant").toLowerCase().trim();
    console.log("🔍 Final query to Foursquare:", query);

    // ✅ ابحث في Foursquare API الجديد
    let results = await searchPlaces(query, lat, lon);
    console.log("📌 Foursquare results:", results);

    if (!results || results.length === 0) {
      results = [{ name: "❌ لا توجد نتائج من Foursquare", address: "—" }];
    }

    // 🧠 خلي Dooby يرتب الرد النهائي للمستخدم
    const formatted = await askDobby(`
      هذه نتائج بحث من Foursquare: ${JSON.stringify(results)} 
      رجاءً أعرضها للمستخدم في شكل قائمة أماكن وعناوين واضحة.
    `);

    res.json({ query: question, analysis: query, results, formatted });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
