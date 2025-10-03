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

    // ✅ اطبع اللي جاي من الفرونت اند
    console.log("🟢 Incoming request:", { question, lat, lon });

    if (!lat || !lon) {
      return res.status(400).json({ error: "❌ Location (lat, lon) is required" });
    }

    // ✅ حالياً هنخلي الكلمة دايمًا restaurant للاختبار
    let analysis = "restaurant";

    console.log("🔍 Final query to Foursquare:", analysis);

    // ✅ ابحث في Foursquare
    let results = await searchPlaces(analysis, lat, lon);
    console.log("📌 Foursquare results:", results);

    // fallback
    if (!results || results.length === 0) {
      results = [{ name: "❌ لا توجد نتائج من Foursquare", address: "—" }];
    }

    // ✅ صياغة النتائج
    const formatted = await askDobby(`
      هذه نتائج بحث من Foursquare: ${JSON.stringify(results)} 
      رجاءً أعرضها للمستخدم كقائمة أماكن وعناوين.
    `);

    res.json({ query: question, analysis, results, formatted });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
