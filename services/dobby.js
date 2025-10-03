import fetch from "node-fetch";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

export async function askDobby(question) {
  try {
    const res = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DOBBY_API_KEY}`
      },
      body: JSON.stringify({
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [{ role: "user", content: question }],
        max_tokens: 200
      })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response";
  } catch (err) {
    console.error("❌ Error in Dobby:", err.message);
    return "Error with Dobby";
  }
}
