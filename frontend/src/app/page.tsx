"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Leaf, Sparkles, ArrowRight, Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthenticationContext";
import { getMyShop } from "@/services/shops";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    void (async () => {
      if (user.is_shop_owner) {
        try {
          await getMyShop();
          router.replace("/shop");
        } catch {
          router.replace("/shop/setup");
        }
      } else {
        router.replace("/deals");
      }
    })();
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 mb-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
        <Sparkles size={13} />
        Fight Food Waste · Save Money
      </div>

      <div className="relative z-10 flex items-center gap-3 mb-4">
        <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-2xl shadow-emerald-500/40">
          <Leaf size={32} />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight">
          Fresh<span className="text-emerald-400">Save</span>
        </h1>
      </div>

      <p className="relative z-10 text-gray-400 text-lg font-medium mb-10 text-center max-w-md leading-relaxed">
        Near-expiry grocery deals from local shops. Sign in or create an account to get started.
      </p>

      <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          href="/auth?tab=login"
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl px-8 py-4 shadow-2xl shadow-emerald-500/30 transition-all hover:scale-[1.02]"
        >
          Log in
          <ArrowRight size={18} />
        </Link>
        <Link
          href="/auth?tab=signup"
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold rounded-2xl px-8 py-4 transition-all hover:scale-[1.02]"
        >
          Sign up
        </Link>
      </div>

      <p className="relative z-10 mt-8 text-sm text-gray-500">
        Want to browse first?{" "}
        <Link href="/deals" className="text-emerald-400 font-semibold hover:text-emerald-300">
          View deals
        </Link>
        {" · "}
        <Link href="/map" className="text-emerald-400 font-semibold hover:text-emerald-300">
          Map
        </Link>
      </p>

      <p className="relative z-10 mt-10 text-xs text-gray-600 text-center">
        © 2025 FreshSave
      </p>
    </div>
  );
}
