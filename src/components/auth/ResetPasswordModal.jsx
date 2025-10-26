"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoLockClosedOutline, IoKeyOutline, IoEyeOutline, IoEyeOffOutline, IoAlertCircleOutline, IoCheckmarkCircleOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import Link from "next/link";

export default function ResetPasswordModal({ email }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password strength validation
  const passwordStrength = useMemo(() => {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const isValid = Object.values(checks).every(Boolean);

    return {
      ...checks,
      passedChecks,
      totalChecks: 5,
      isValid,
    };
  }, [password]);

  const passwordsMatch = confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate password strength
    if (!passwordStrength.isValid) {
      setError("Password does not meet all requirements");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?message=password-reset");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600">Enter the code sent to {email}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <IoCheckmarkCircleOutline className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-700 font-semibold">Password reset successful!</p>
              <p className="text-sm text-green-600 mt-1">Redirecting you to login...</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <IoAlertCircleOutline className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Verification Code Field */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <IoKeyOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={loading || success}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="At least 8 characters"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || success}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="w-5 h-5" />
                ) : (
                  <IoEyeOutline className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Password Requirements:</span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {passwordStrength.passedChecks}/{passwordStrength.totalChecks}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {passwordStrength.minLength ? (
                      <IoCheckmarkOutline className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <IoCloseOutline className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordStrength.minLength ? 'text-green-700' : 'text-gray-600'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasUppercase ? (
                      <IoCheckmarkOutline className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <IoCloseOutline className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasUppercase ? 'text-green-700' : 'text-gray-600'}`}>
                      One uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasLowercase ? (
                      <IoCheckmarkOutline className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <IoCloseOutline className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasLowercase ? 'text-green-700' : 'text-gray-600'}`}>
                      One lowercase letter (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasNumber ? (
                      <IoCheckmarkOutline className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <IoCloseOutline className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-700' : 'text-gray-600'}`}>
                      One number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasSpecial ? (
                      <IoCheckmarkOutline className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <IoCloseOutline className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasSpecial ? 'text-green-700' : 'text-gray-600'}`}>
                      One special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="Confirm your password"
                className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  confirmPassword
                    ? passwordsMatch
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading || success}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline className="w-5 h-5" />
                ) : (
                  <IoEyeOutline className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                {passwordsMatch ? (
                  <>
                    <IoCheckmarkOutline className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">Passwords match</span>
                  </>
                ) : (
                  <>
                    <IoCloseOutline className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success || !passwordStrength.isValid || !passwordsMatch}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
            ) : success ? (
              "Password Reset!"
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back to Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
