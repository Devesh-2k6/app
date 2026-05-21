"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, Package, RefreshCw } from "lucide-react";

import { DealProductCard } from "@/components/products/DealProductCard";
import { getErrorMessage } from "@/api/errors";
import { useProducts } from "@/hooks/useProducts";
import { buildDealProductCardProps } from "@/lib/products/map-deal-product";

export default function CustomerDealsPage() {
  const { products, status, errorMessage, refetch } = useProducts({ hideExpired: true });
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTogglePlay = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const showList = status === "success" && products.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center gap-3">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-200" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Nearby Deals</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active discounts near you</p>
        </div>
        <Link
          href="/map"
          className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-xl"
        >
          <MapPin size={16} />
          Map
        </Link>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {status === "loading" && (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <p className="text-sm text-gray-500">Loading deals…</p>
          </div>
        )}

        {status === "error" && (
          <div className="py-12 text-center px-4">
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              {errorMessage ?? getErrorMessage(new Error("Failed to load deals"))}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Make sure the API is running:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">uvicorn main:app --port 8000</code>
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {(status === "empty" || (status === "success" && products.length === 0)) && (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p>No active deals yet.</p>
            <p className="text-sm mt-2">Shops can add deals from the shopkeeper dashboard.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 text-emerald-600 font-semibold text-sm"
            >
              Refresh
            </button>
          </div>
        )}

        {showList && (
          <div className="space-y-4">
            {products.map((product, index) => (
              <DealProductCard
                key={product.id}
                {...buildDealProductCardProps(product, index, playingId, handleTogglePlay)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
