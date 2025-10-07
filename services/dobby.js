import { searchPlaces } from "./foursquare.js";

// ✅ دوبي: العقل الذكي
export async function askDobby(question) {
  question = question.toLowerCase();

  // --- لو السؤال عن مطاعم ---
  if (question.includes("مطعم") || question.includes("اكل") || question.includes("restaurant")) {
    let category = null;

    // تصنيف حسب نوع الأكل
    if (question.includes("سمك") || question.includes("seafood")) category = "4bf58dd8d48988d1ce941735"; // Seafood
    if (question.includes("بيتزا") || question.includes("pizza")) category = "4bf58dd8d48988d1ca941735"; // Pizza
    if (question.includes("لحمة") || question.includes("ستيك") || question.includes("meat") || question.includes("steak")) category = "4bf58dd8d48988d1cc941735"; // Steakhouse
    if (question.includes("شعبي") || question.includes("popular")) category = "52e81612bcbc57f1066b7a00"; // Middle Eastern / Egyptian popular food

    // استدعاء Foursquare
    const results = await searchPlaces({
      ll: "31.044839,31.406334", // إحداثيات الموقع (ممكن نخليها Dynamic من المستخدم لاحقاً)
      category,
      limit: 5
    });

    if (!results.length) {
      return "🙁 دوبي: معنديش نتائج دلوقتي حسب طلبك، جرب نوع أكل تاني.";
    }

    // صياغة الرد بشكل منظم
    let reply = "🏠 أقرب المطاعم لطلبك:\n";
    reply += results.map((r, i) => 
      `${i+1}. 📍 ${r.name} - ${r.location.formatted_address || "بدون عنوان"}`
    ).join("\n");

    return reply;
  }

  // --- لو السؤال عن كافيه ---
  if (question.includes("كافيه") || question.includes("قهوة") || question.includes("cafe") || question.includes("coffee")) {
    const results = await searchPlaces({
      ll: "31.044839,31.406334",
      category: "4bf58dd8d48988d16d941735", // Coffee Shop
      limit: 5
    });

    if (!results.length) {
      return "☕ دوبي: ملاقتش كافيهات قريبة.";
    }

    let reply = "☕ أقرب الكافيهات:\n";
    reply += results.map((r, i) => 
      `${i+1}. 📍 ${r.name} - ${r.location.formatted_address || "بدون عنوان"}`
    ).join("\n");

    return reply;
  }

  // --- رد عام لأي أسئلة تانية ---
  return "🤖 دوبي: ممكن تسألني عن أقرب مطاعم (بيتزا، سمك، لحمة، شعبي) أو كافيهات وأنا هساعدك.";
}
