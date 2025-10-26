"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiCheck } from "react-icons/fi";

export default function VerifyEmailModal({ email, username }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username || email, email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed. Please try again");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?message=verified");
      }, 2000);
    } catch (err) {
      console.error("Verification error:", err);
      setError("An unexpected error occurred. Please try again");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    setResendLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username || email, email, action: "resend" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend code. Please try again");
        setResendLoading(false);
        return;
      }

      setResendMessage("A new verification code has been sent to your email");
      setResendLoading(false);
    } catch (err) {
      console.error("Resend code error:", err);
      setError("An unexpected error occurred. Please try again");
      setResendLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-emerald-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full mb-4">
          <FiMail className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          We sent a verification code to <span className="font-semibold text-emerald-700">{email}</span>
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">
            Email verified successfully! Redirecting to login...
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Resend Success Message */}
      {resendMessage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-600 text-sm">{resendMessage}</p>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold"
            placeholder="000000"
            maxLength={6}
            required
            disabled={success}
          />
          <p className="mt-2 text-xs text-gray-500">
            Enter the 6-digit code from your email
          </p>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading || success || code.length !== 6}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </span>
          ) : success ? (
            "Verified!"
          ) : (
            "Verify Email"
          )}
        </button>
      </form>

      {/* Resend Code */}
      {!success && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-emerald-600 hover:text-emerald-700 font-semibold focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          </p>
        </div>
      )}

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-gray-600 hover:text-emerald-600 font-medium transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
