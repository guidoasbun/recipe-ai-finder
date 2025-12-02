import { generateRecipes, generateImage } from "@/lib/openai";

export async function POST(req) {
  const { ingredients } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Generate all recipes first (single OpenAI call)
        const recipes = await generateRecipes(ingredients);

        // Track completed recipes to stream them as images finish
        let completedCount = 0;

        // Generate images in parallel, streaming each recipe as its image completes
        const imagePromises = recipes.map(async (recipe, index) => {
          const image = await generateImage(
            `A beautiful photo of ${recipe.title}, plated`
          );

          const recipeWithImage = { ...recipe, image };

          // Send this recipe immediately when its image is ready
          const data = JSON.stringify({ recipe: recipeWithImage, index });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));

          completedCount++;

          // If all recipes are done, send the done event
          if (completedCount === recipes.length) {
            controller.enqueue(encoder.encode(`data: {"done": true}\n\n`));
            controller.close();
          }
        });

        await Promise.all(imagePromises);
      } catch (error) {
        console.error("❌ Error in streaming recipe generation:", error);
        const errorData = JSON.stringify({ error: "Recipe generation failed" });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
