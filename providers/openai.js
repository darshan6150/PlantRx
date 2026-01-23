import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function gptWrite(system, user, model = "gpt-4o-mini") {
  const res = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [{ role: "system", content: system }, { role: "user", content: user }]
  });
  return res.choices?.[0]?.message?.content ?? "";
}