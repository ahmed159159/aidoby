import Fireworks from "@fireworks-ai/sdk";

const client = new Fireworks({
  apiKey: process.env.FIREWORKS_API_KEY
});

// ✅ systemPrompt
const systemPrompt = `
You are Dobby 🤖, a friendly AI travel assistant.
Your job:
1. Understand user questions (food, cafes, entertainment).
2. If unclear → ask a clarification question.
3. If clear → return an intent = "search_place" + query text.
4. If it's just chatting → intent = "chat".

Return JSON ONLY:
{
  "intent": "search_place" | "chat",
  "message": "your reply to the user",
  "query": "if search_place, put search keyword here"
}
`;

export async function askDobby(question) {
  const response = await client.chat.completions.create({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ],
    temperature: 0.5,
    max_tokens: 300
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (e) {
    return {
      intent: "chat",
      message: "ممكن تعيد صياغة سؤالك؟",
      query: ""
    };
  }
}
