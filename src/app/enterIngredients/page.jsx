"use client";

import { useState } from "react";
import LoadingRecipes from "@/components/loading-recipes/loading-recipes";

export default function EnterIngredients() {
  const [ingredients, setIngredients] = useState(["", "", ""]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        ingredients: ingredients.filter((i) => i.trim() !== ""),
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setRecipes(data.result);
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

      {loading && <LoadingRecipes />}
      {Array.isArray(recipes) && recipes.length > 0 && (
        <div className="grid gap-6">
          {recipes.map((recipe, i) => (
            <div key={i} className="p-4 border rounded bg-white shadow">
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              <h3 className="font-semibold">Ingredients:</h3>
              <ul className="list-disc ml-5 mb-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
              <h3 className="font-semibold">Steps:</h3>
              <ol className="list-decimal ml-5">
                {recipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
