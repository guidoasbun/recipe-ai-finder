'use client';
import { useEffect, useState } from 'react';

export default function ViewSavedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/save-recipe/get');
        if (!res.ok) throw new Error('Failed to load recipes');
        const data = await res.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Saved Recipes</h1>
      {recipes.length === 0 ? (
        <p>No saved recipes found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe, index) => (
            <li key={index} className="border rounded p-4 shadow">
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded mb-2" />
              )}
              <p>{recipe.description}</p>
              <button
                onClick={async () => {
                  const confirmDelete = window.confirm(`Are you sure you want to delete "${recipe.title}"?`);
                  if (!confirmDelete) return;

                  try {
                    const res = await fetch('/api/save-recipe/delete', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        recipeID: recipe.recipeID,
                        imageKey: recipe.image?.split('/').slice(-1)[0], // adjust if key is nested
                      }),
                    });

                    if (!res.ok) throw new Error('Failed to delete');
                    setRecipes((prev) => prev.filter((r) => r.recipeID !== recipe.recipeID));
                  } catch (err) {
                    console.error('Delete error:', err);
                  }
                }}
                className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}