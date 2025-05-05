import { useSession } from "next-auth/react";
import { useState } from "react";

export default function RecipeCard({ recipe }) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/save-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.email,
          recipe,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowSaveModal(true);
      } else {
        alert("Failed to save: " + data.error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-3"
        />
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-1">Description:</h3>
      <h1>{recipe.description}</h1>
      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-1">Ingredients:</h3>
      <ul className="list-disc ml-6 text-gray-600 space-y-1 mb-2">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-1">Steps:</h3>
      <ol className="list-decimal ml-6 text-gray-600 space-y-1">
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
      {session && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`mt-4 px-4 py-2 text-white rounded transition ${
            isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save Recipe"}
        </button>
      )}
      {showSaveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">Recipe Saved!</h2>
            <button
              onClick={() => setShowSaveModal(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
