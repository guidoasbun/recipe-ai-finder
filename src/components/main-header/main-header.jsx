"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoRestaurantOutline, IoSparklesSharp, IoBookSharp, IoLogOutOutline, IoHandRightOutline, IoClose, IoMenu } from "react-icons/io5";
import { GiCookingPot } from "react-icons/gi";

export default function MainHeader() {
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Handle scroll for sticky header effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/revoke", {
        method: "POST",
        credentials: "include"
      });

      // Then sign out with callback
      await signOut({
        callbackUrl: "/",
        redirect: true
      });

      // Clear any local storage if you're using it
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
          : "bg-white/80 backdrop-blur-sm shadow-md border-b border-emerald-100"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <IoRestaurantOutline className="w-8 h-8 text-emerald-700" />
            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              RecipeAI
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors border border-emerald-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <IoClose className="w-6 h-6" />
            ) : (
              <IoMenu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            {session ? (
              <>
                {/* User Greeting */}
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <IoHandRightOutline className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {session?.user?.username || session?.user?.email?.split("@")[0]}
                  </span>
                </div>

                {/* Navigation Links */}
                <Link
                  href="/enterIngredients"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <GiCookingPot className="w-5 h-5" />
                  Enter Ingredients
                </Link>

                <Link
                  href="/viewsavedrecipes"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 border border-emerald-300 rounded-xl font-medium hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-md transition-all duration-200"
                >
                  <IoBookSharp className="w-5 h-5" />
                  My Recipes
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 hover:shadow-md transition-all duration-200 border border-gray-300"
                >
                  <IoLogOutOutline className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <IoSparklesSharp className="w-5 h-5" />
                Log In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            {session ? (
              <>
                {/* Mobile User Greeting */}
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <IoHandRightOutline className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Hello, {session?.user?.username || session?.user?.email?.split("@")[0]}
                  </span>
                </div>

                {/* Mobile Navigation Links */}
                <Link
                  href="/enterIngredients"
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <GiCookingPot className="w-5 h-5" />
                  Enter Ingredients
                </Link>

                <Link
                  href="/viewsavedrecipes"
                  className="flex items-center gap-2 px-4 py-3 bg-white text-emerald-700 border border-emerald-300 rounded-xl font-medium hover:bg-emerald-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <IoBookSharp className="w-5 h-5" />
                  My Saved Recipes
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all border border-gray-300"
                >
                  <IoLogOutOutline className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <IoSparklesSharp className="w-5 h-5" />
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
