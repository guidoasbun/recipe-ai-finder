"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex flex-col items-center justify-start pt-75 min-h-screen px-4 text-center bg-gradient-to-br from-green-100 to-white">
      <h1 className="text-7xl font-extrabold text-green-700 mb-4">RecipeAI</h1>
      <p className="text-lg text-gray-700 max-w-xl mb-8">
        Turn the ingredients in your pantry into mouthwatering meals using the
        power of AI. Just tell us what you have — we’ll take care of the rest!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {session ? (
          <Link href="/enterIngredients">
            <span className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300">
              Enter Ingredients
            </span>
          </Link>
        ) : (
          <Link href="/api/auth/signin?callbackUrl=/enterIngredients">
            <span className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300">
              Log In
            </span>
          </Link>
        )}

        <Link href="/about">
          <span className="bg-white border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg hover:bg-green-100 transition duration-300">
            Learn More
          </span>
        </Link>
      </div>
    </main>
  );
}
