"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function MainHeader() {
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/revoke", {
        method: "POST",
        credentials: "include",
      });

      // Then sign out with callback
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });

      // Clear any local storage if you're using it
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="bg-gradient-to-r from-green-200 to-green-50 shadow-md p-4 sm:p-6 rounded-b-lg flex flex-col sm:flex-row justify-between items-center border-b border-green-300 gap-4 sm:gap-0">
      <Link href="/" className="text-4xl sm:text-5xl font-extrabold text-green-700 text-center sm:text-left">
        RecipeAI
      </Link>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden text-green-700 border border-green-400 p-2 rounded"
      >
        ☰
      </button>
      <div className={`flex-col sm:flex sm:flex-row items-center gap-4 ${menuOpen ? 'flex' : 'hidden'} sm:gap-4`}>
        {session ? (
          <>
            <span className="text-gray-700 text-xl sm:text-2xl font-extrabold text-center sm:text-left">
              Hello, {session?.user?.username || session?.user?.email}
            </span>

            <Link href="/enterIngredients"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Enter Ingredients
            </Link>

            <Link
              href="/viewsavedrecipes"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              View your saved recipes
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/api/auth/signin?callbackUrl=/enterIngredients">
            <span className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300">
              Log In
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
