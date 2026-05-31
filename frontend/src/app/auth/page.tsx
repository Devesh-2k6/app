"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Leaf, Loader2, Store, ShoppingBag, XCircle, Sparkles } from "lucide-react";

import { getErrorMessage } from "@/api/errors";
import { useAuth } from "@/contexts/AuthenticationContext";
import { clearRoleIntent, getRoleIntent, setRoleIntent } from "@/lib/auth-storage";
import { getMyShop } from "@/services/shops";
import { login, register, sendOtp, verifyOtp } from "@/services/auth";

type Tab = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, isAuthenticated, isLoading: authLoading, user } = useAuth();

  const intentParam = searchParams.get("role");
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [isShopOwner, setIsShopOwner] = useState(intentParam === "shop_owner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // OTP Verification States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleVerifyAndRegister = async (e: FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setVerifyingOtp(true);
    try {
      const vRes = await verifyOtp(phoneNumber.trim(), otpCode.trim());
      if (vRes.verified) {
        setSubmitting(true);
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          is_shop_owner: isShopOwner,
          phone_number: phoneNumber.trim(),
        });
        loginUser(res.user, res.access_token);
        clearRoleIntent();
        setShowOtpModal(false);
        await redirectAfterAuth(res.user.is_shop_owner);
      }
    } catch (err: unknown) {
      setOtpError(getErrorMessage(err));
    } finally {
      setVerifyingOtp(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (intentParam === "shop_owner") {
      setIsShopOwner(true);
      setRoleIntent("shop_owner");
    } else if (intentParam === "customer") {
      setIsShopOwner(false);
      setRoleIntent("customer");
    }
  }, [intentParam]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !user) return;

    void (async () => {
      const intent = getRoleIntent();
      if (user.is_shop_owner || intent === "shop_owner") {
        try {
          await getMyShop();
          clearRoleIntent();
          router.replace("/shop");
        } catch {
          clearRoleIntent();
          router.replace("/shop/setup");
        }
      } else {
        clearRoleIntent();
        router.replace("/deals");
      }
    })();
  }, [authLoading, isAuthenticated, user, router]);

  const redirectAfterAuth = async (isOwner: boolean) => {
    if (isOwner) {
      try {
        await getMyShop();
        router.push("/shop");
      } catch {
        router.push("/shop/setup");
      }
    } else {
      router.push("/deals");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!phoneNumber.trim()) {
        setError("Mobile phone number is required for verification.");
        return;
      }
      
      setSendingOtp(true);
      try {
        await sendOtp(phoneNumber.trim());
        setShowOtpModal(true);
        return;
      } catch (err) {
        setError("Failed to send OTP verification code: " + getErrorMessage(err));
        return;
      } finally {
        setSendingOtp(false);
      }
    }

    setSubmitting(true);
    try {
      const res = await login({ email: email.trim(), password });
      loginUser(res.user, res.access_token);
      clearRoleIntent();
      await redirectAfterAuth(res.user.is_shop_owner);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="animate-spin text-emerald-500" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <Link href="/" className="relative z-10 flex items-center gap-2 mb-8 text-white">
        <div className="bg-emerald-500 p-2 rounded-xl">
          <Leaf size={22} />
        </div>
        <span className="text-2xl font-black">
          Fresh<span className="text-emerald-400">Save</span>
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 py-4 text-sm font-bold transition ${
              tab === "login"
                ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5"
                : "text-gray-500"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 py-4 text-sm font-bold transition ${
              tab === "signup"
                ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5"
                : "text-gray-500"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {tab === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShopOwner(false)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition ${
                      !isShopOwner
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-500"
                    }`}
                  >
                    <ShoppingBag size={18} />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShopOwner(true)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition ${
                      isShopOwner
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-500"
                    }`}
                  >
                    <Store size={18} />
                    Shopkeeper
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g., 9876543210"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete={tab === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 pr-11 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {tab === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 pb-6 px-4">
          Browse deals without an account from the{" "}
          <Link href="/" className="text-emerald-600 font-semibold">
            home page
          </Link>
          .
        </p>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <XCircle size={20} />
            </button>

            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm mb-4">
              <Sparkles size={18} />
              OTP SMS Verification
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Verify Mobile Number
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              We simulated dispatching a 6-digit OTP code to +91 {phoneNumber}. Please check your backend console logs.
            </p>

            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g., 123456"
                  className="w-full text-center tracking-widest text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 outline-none focus:border-emerald-500"
                />
              </div>

              {otpError && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg p-2.5">
                  ❌ {otpError}
                </p>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyingOtp || otpCode.length !== 6 || submitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>Verify Code</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
