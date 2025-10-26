"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  IoRestaurantOutline,
  IoSparklesSharp,
  IoHardwareChipOutline,
  IoHeartSharp,
  IoBookmarkSharp,
  IoColorPaletteSharp,
  IoFlashSharp,
  IoLeafSharp,
  IoCloudOutline,
  IoShieldCheckmarkOutline,
  IoRocketOutline,
  IoPeopleOutline
} from "react-icons/io5";
import { GiCookingPot } from "react-icons/gi";
import { MdArrowForward } from "react-icons/md";
import { SiNextdotjs, SiReact, SiOpenai, SiAmazon, SiTerraform } from "react-icons/si";

export default function About() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-40 blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-30 blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-emerald-300 rounded-full opacity-20 blur-lg"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-emerald-700 shadow-sm border border-emerald-200">
              <IoRestaurantOutline className="w-5 h-5" />
              About RecipeAI
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent leading-tight">
            Transforming Ingredients
            <br />
            Into Culinary Inspiration
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            RecipeAI is your intelligent cooking companion that turns everyday ingredients into
            <span className="font-semibold text-emerald-700"> extraordinary meals</span>
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 text-gray-800">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              We&apos;ve all been there — standing in front of the fridge, staring at random ingredients,
              wondering what to cook. RecipeAI was born from this everyday challenge that millions face.
            </p>
            <p>
              By combining the power of artificial intelligence with culinary expertise, we&apos;ve created
              a platform that instantly generates personalized recipes based on what you already have.
              No more food waste, no more meal planning stress, just delicious possibilities at your fingertips.
            </p>
            <p>
              Whether you&apos;re a seasoned chef or just starting your cooking journey, RecipeAI adapts
              to your skill level, dietary preferences, and taste preferences to deliver recipes that are
              perfect for you.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-800">
            How RecipeAI Works
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
            Powered by cutting-edge AI technology to deliver personalized culinary experiences
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GiCookingPot className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Enter Ingredients</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Simply list what you have in your pantry, fridge, or cupboard
              </p>
            </div>

            {/* Step 2 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IoHardwareChipOutline className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">AI Magic</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Our AI analyzes your ingredients and generates personalized recipe suggestions
              </p>
            </div>

            {/* Step 3 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IoColorPaletteSharp className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Beautiful Images</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Get AI-generated images of each recipe to visualize your meal
              </p>
            </div>

            {/* Step 4 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IoBookmarkSharp className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Save & Cook</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Save your favorites and access them anytime you&apos;re ready to cook
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-800">
            Key Features
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
            Everything you need for a seamless cooking experience
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoFlashSharp className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Instant Results</h3>
                <p className="text-gray-600 text-sm">
                  Get multiple recipe suggestions in seconds, powered by GPT-3.5-turbo
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoLeafSharp className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Healthy Options</h3>
                <p className="text-gray-600 text-sm">
                  Recipes tailored to your dietary preferences and nutritional goals
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoShieldCheckmarkOutline className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Secure Authentication</h3>
                <p className="text-gray-600 text-sm">
                  Sign in with AWS Cognito or Google OAuth for secure access
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoColorPaletteSharp className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">AI-Generated Images</h3>
                <p className="text-gray-600 text-sm">
                  DALL-E 3 creates stunning visuals for every recipe suggestion
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoCloudOutline className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Cloud Storage</h3>
                <p className="text-gray-600 text-sm">
                  Save recipes to DynamoDB and images to S3 for reliable access
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoHeartSharp className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Personal Collection</h3>
                <p className="text-gray-600 text-sm">
                  Build your own recipe library and access it from anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-800">
            Built With Modern Technology
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
            Powered by industry-leading tools and frameworks for performance and reliability
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Next.js & React */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <SiNextdotjs className="w-10 h-10 text-gray-900" />
                <SiReact className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Next.js 15 & React 19</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built on the latest web technologies for blazing-fast performance and optimal user experience
              </p>
            </div>

            {/* OpenAI */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <SiOpenai className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">OpenAI Integration</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                GPT-3.5-turbo for intelligent recipe generation and DALL-E 3 for beautiful food imagery
              </p>
            </div>

            {/* AWS */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <SiAmazon className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">AWS Infrastructure</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ECS Fargate, DynamoDB, S3, Cognito, and more for scalable, secure cloud deployment
              </p>
            </div>

            {/* Authentication */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
                <IoShieldCheckmarkOutline className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">NextAuth.js</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Secure authentication with AWS Cognito and Google OAuth integration
              </p>
            </div>

            {/* Terraform */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <SiTerraform className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Infrastructure as Code</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Terraform-managed infrastructure for repeatable, version-controlled deployments
              </p>
            </div>

            {/* ARM64 */}
            <div className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-4">
                <IoRocketOutline className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">ARM64 Graviton</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Running on AWS Graviton processors for better performance and cost efficiency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <IoPeopleOutline className="w-10 h-10 text-emerald-700" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800">
            Built with Passion
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
            RecipeAI was created to solve a real problem: making cooking accessible and enjoyable for everyone.
            We believe that great meals shouldn&apos;t require complex meal planning or grocery shopping — just
            creativity and the ingredients you already have.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Whether you&apos;re cooking for one or feeding a family, trying a new cuisine or sticking to your
            favorites, RecipeAI is here to inspire your next culinary adventure.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of home cooks who are discovering new recipes every day
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <Link href="/enterIngredients">
                <span className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50">
                  <GiCookingPot className="w-5 h-5" />
                  Enter Ingredients
                  <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <span className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50">
                    <IoSparklesSharp className="w-5 h-5" />
                    Sign Up Free
                    <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <Link href="/login">
                  <span className="group inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-emerald-50 hover:shadow-lg transition-all duration-300 shadow-md">
                    Already have an account? Log In
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
