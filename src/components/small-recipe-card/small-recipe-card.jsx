import Link from 'next/link';

export default function SmallRecipeCard({ recipe, onDelete }) {
  return (
    <div className="border rounded shadow hover:shadow-lg transition-transform transform hover:scale-[1.02] hover:-translate-y-0.5">
      <div className="relative">
        <Link href={`/recipes/${recipe.recipeID}`} className="block p-4">
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded my-2"
            />
          )}
          <p>{recipe.description}</p>
        </Link>
        <div className="p-4 pt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete();
            }}
            className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
