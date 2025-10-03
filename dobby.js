import axios from "axios";

export async function askDobby(question) {
  const resp = await axios.post(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      messages: [{ role: "user", content: question }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DOBBY_API_KEY}`,
      },
    }
  );

  return resp.data.choices[0].message.content;
}
