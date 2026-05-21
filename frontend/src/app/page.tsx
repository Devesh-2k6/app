"use client";

import Link from "next/link";
import { Leaf, ShoppingBag, Store, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

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

      <p className="relative z-10 text-gray-400 text-lg font-medium mb-12 text-center max-w-md leading-relaxed">
        Near-expiry grocery deals from local shops, delivered straight to your neighbourhood.
      </p>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/deals"
          id="continue-as-customer"
          className="group flex-1 flex flex-col items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl px-8 py-6 shadow-2xl shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-emerald-400/40"
        >
          <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
            <ShoppingBag size={24} />
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold">Continue as Customer</p>
            <p className="text-emerald-100 text-xs font-medium mt-0.5">Browse deals & map</p>
          </div>
          <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/shop"
          id="continue-as-shopkeeper"
          className="group flex-1 flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white font-bold rounded-2xl px-8 py-6 shadow-2xl transition-all duration-200 hover:scale-[1.03]"
        >
          <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/15 transition">
            <Store size={24} />
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold">Continue as Shopkeeper</p>
            <p className="text-gray-400 text-xs font-medium mt-0.5">Manage your shop & deals</p>
          </div>
          <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <p className="relative z-10 mt-10 text-xs text-gray-600 text-center">
        © 2025 FreshSave — Sign in coming soon.
      </p>
    </div>
  );
}
