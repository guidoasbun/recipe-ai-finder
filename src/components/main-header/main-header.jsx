"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MainHeader() {
  const { data: session } = useSession();
  console.log(session);

  const router = useRouter();

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
    <header className="bg-gradient-to-r from-green-200 to-green-50 shadow-md p-6 rounded-b-lg flex justify-between items-center border-b border-green-300">
      <Link href="/" className="text-5xl font-extrabold text-green-700 mb-4">
        RecipeAI
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-700 text-lg max-w-xl">
              Hello, {session?.user?.username || session?.user?.email}
            </span>
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
