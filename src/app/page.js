"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { IoRestaurantOutline, IoSparklesSharp, IoFlashSharp, IoLeafSharp, IoColorPaletteSharp, IoHardwareChipOutline, IoHeartSharp, IoBookmarkSharp } from "react-icons/io5";
import { GiCookingPot } from "react-icons/gi";
import { MdArrowForward, MdArrowOutward } from "react-icons/md";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-40 blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-30 blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-emerald-300 rounded-full opacity-20 blur-lg"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-emerald-700 shadow-sm border border-emerald-200">
              <IoRestaurantOutline className="w-5 h-5" />
              AI-Powered Recipe Generation
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent leading-tight">
            RecipeAI
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-4 leading-relaxed font-light">
            Transform your pantry ingredients into
            <span className="font-semibold text-emerald-700"> delicious, healthy meals </span>
            with the power of AI
          </p>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Just tell us what you have — we'll create personalized recipes tailored to your ingredients, preferences, and dietary needs
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {session ? (
              <Link href="/enterIngredients">
                <span className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50">
                  <GiCookingPot className="w-5 h-5" />
                  Enter Ingredients
                  <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <Link href="/api/auth/signin?callbackUrl=/enterIngredients">
                <span className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50">
                  <IoSparklesSharp className="w-5 h-5" />
                  Get Started Free
                  <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}

            <Link href="/about">
              <span className="group inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-emerald-50 hover:shadow-lg transition-all duration-300 shadow-md">
                Learn More
                <MdArrowOutward className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <IoFlashSharp className="w-6 h-6 text-emerald-600" />
              <span>Instant Recipes</span>
            </div>
            <div className="flex items-center gap-2">
              <IoLeafSharp className="w-6 h-6 text-emerald-600" />
              <span>Healthy Options</span>
            </div>
            <div className="flex items-center gap-2">
              <IoColorPaletteSharp className="w-6 h-6 text-emerald-600" />
              <span>AI-Generated Images</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-800">
            Why Choose RecipeAI?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
            Smart cooking made simple with AI-powered recipe suggestions
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IoHardwareChipOutline className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI analyzes your ingredients and generates personalized recipes with detailed instructions and beautiful images
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IoHeartSharp className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Healthy Choices</h3>
              <p className="text-gray-600 leading-relaxed">
                Get nutritious meal suggestions that align with your dietary preferences and help you maintain a balanced lifestyle
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IoBookmarkSharp className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Save & Share</h3>
              <p className="text-gray-600 leading-relaxed">
                Save your favorite recipes to your personal collection and access them anytime, anywhere
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
