"use client";

import { useState, useEffect } from "react";
import LoadingRecipes from "@/components/loading-recipes/loading-recipes";
import RecipeCard from "@/components/recipe-card/recipe-card";

export default function EnterIngredients() {
  const [ingredients, setIngredients] = useState(["", "", ""]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipesReceived, setRecipesReceived] = useState(0);

  // Load recipes from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("savedRecipes");
      if (stored) {
        setRecipes(JSON.parse(stored));
      }
    }
  }, []);

// Update localStorage when new recipes are set
  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem("savedRecipes", JSON.stringify(recipes));
    }
  }, [recipes]);

  async function handleGenerate() {
    setLoading(true);
    setRecipes([]);
    setRecipesReceived(0);

    try {
      const res = await fetch("/api/generate-stream", {
        method: "POST",
        body: JSON.stringify({
          ingredients: ingredients.filter((i) => i.trim() !== ""),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            const data = JSON.parse(jsonStr);

            if (data.done) {
              setLoading(false);
              return;
            }

            if (data.error) {
              console.error("Stream error:", data.error);
              setLoading(false);
              return;
            }

            if (data.recipe) {
              setRecipes((prev) => {
                const updated = [...prev];
                updated[data.index] = data.recipe;
                return updated;
              });
              setRecipesReceived((prev) => prev + 1);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate recipes:", error);
    }

    setLoading(false);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Enter Your Ingredients</h1>
      {ingredients.map((item, index) => (
        <input
          key={index}
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder={`Ingredient ${index + 1}`}
          value={item}
          onChange={(e) => {
            const updated = [...ingredients];
            updated[index] = e.target.value;
            setIngredients(updated);
          }}
        />
      ))}

      <div className="flex flex-col items-start gap-2 mb-6">
        <button
          type="button"
          onClick={() => setIngredients([...ingredients, ""])}
          className="bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded hover:bg-blue-200 transition"
        >
          + Add more ingredients
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-4 py-2 rounded font-semibold transition ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Recipes"}
        </button>
      </div>

      {loading && <LoadingRecipes recipesReceived={recipesReceived} />}
      {Array.isArray(recipes) && recipes.length > 0 && (
        <div className="grid gap-6">
          {recipes.map((recipe, i) =>
            recipe ? <RecipeCard key={i} recipe={recipe} /> : null
          )}
        </div>
      )}
    </main>
  );
}
