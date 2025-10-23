"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import SignInModal from "@/components/auth/SignInModal";
import Link from "next/link";
import { IoRestaurantOutline } from "react-icons/io5";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/enterIngredients";
  const message = searchParams.get("message");

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-md border-b border-emerald-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform hover:scale-105"
            >
              <IoRestaurantOutline className="w-8 h-8 text-emerald-700" />
              <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                RecipeAI
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-40 blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-30 blur-2xl animate-pulse delay-700"></div>

          {/* Success Message */}
          {message === "verified" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm text-center">
                Email verified successfully! You can now log in.
              </p>
            </div>
          )}

          <SignInModal callbackUrl={callbackUrl} />
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
