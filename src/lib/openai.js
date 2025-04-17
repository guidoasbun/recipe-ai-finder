import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRecipes(ingredients) {
  const prompt = `Create 3 unique recipes using only these ingredients: ${ingredients.filter((i) => i.trim() !== "").join(", ")}.
Assume basic pantry items (salt, pepper, oil, sugar) are available. Provide each recipe with title, ingredients, and step-by-step instructions.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const message =
    completion?.choices?.[0]?.message?.content || "No recipes returned.";
  return message;
}
