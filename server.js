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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ API endpoint
app.post("/api/query", async (req, res) => {
  try {
    const { question, lat, lon } = req.body;

    // ⭕ تحليل السؤال عن طريق دوبي
    const dobbyResponse = await askDobby(question);

    // ⭕ لو دوبي قال في نوع أكل/مكان → استدعاء Foursquare
    let places = [];
    if (dobbyResponse.intent === "search_place") {
      places = await searchPlaces(dobbyResponse.query, lat, lon, 5);
    }

    res.json({
      dobby: dobbyResponse.message,
      places: places
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
