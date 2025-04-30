export default function RecipeCard({ recipe }) {
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
    </div>
  );
}
