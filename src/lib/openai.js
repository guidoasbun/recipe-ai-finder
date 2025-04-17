import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRecipes(ingredients) {
  const prompt = `Create 3 unique recipes using only these ingredients: ${ingredients.filter((i) => i.trim() !== "").join(", ")}.
    Assume basic pantry items (salt, pepper, oil, sugar) are available.
    Return the result as a JSON array like this:
    [
      {
        "title": "Recipe Name",
        "ingredients": ["ingredient1", "ingredient2"],
        "steps": ["Step 1", "Step 2"]
      },
      ...
    ]`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = completion?.choices?.[0]?.message?.content || "[]";
  const recipes = JSON.parse(raw);
  return recipes;
}

export async function generateImage(prompt) {
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1024", // You can change to a supported dimension
    response_format: "url", // Ensure you get a URL
  });

  return image.data?.[0]?.url || null;
}
