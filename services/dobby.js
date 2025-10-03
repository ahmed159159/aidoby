import fetch from "node-fetch";

export async function askDobby(question) {
  const response = await fetch("https://api.fireworks.ai/inference/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DOBBY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      prompt: question,
      max_tokens: 150
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.text || "⚠️ No response from Dobby";
}
