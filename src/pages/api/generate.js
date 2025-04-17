import { generateRecipes } from "@/lib/openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { ingredients } = req.body;
    const result = await generateRecipes(ingredients);
    return res.status(200).json({ result });
  } catch (err) {
    console.error("OpenAI Error:", err);
    return res.status(500).json({ message: "Failed to generate recipes" });
  }
}
