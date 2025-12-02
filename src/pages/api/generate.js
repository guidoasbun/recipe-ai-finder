import { generateRecipes, generateImage } from "@/lib/openai";

/**
 * FALLBACK/BACKUP ENDPOINT
 * This is the original non-streaming recipe generation endpoint.
 * Kept as a backup in case SSE streaming (/api/generate-stream) has compatibility issues.
 * The primary endpoint is now /api/generate-stream which streams recipes as they complete.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { ingredients } = req.body;
    const recipes = await generateRecipes(ingredients);

    const withImages = await Promise.all(
      recipes.map(async (recipe) => ({
        ...recipe,
        image: await generateImage(
          `A beautiful photo of ${recipe.title}, plated`,
        ),
      })),
    );

    res.status(200).json({ result: withImages });
  } catch (err) {
    console.error("❌ Error generating recipes:", err);
    res.status(500).json({ message: "Recipe generation failed." });
  }
}
