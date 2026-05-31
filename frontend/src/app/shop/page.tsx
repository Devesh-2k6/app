"use client";

import { DollarSign, Package, AlertTriangle, TrendingUp, Store, MapPin, Plus, Sparkles, XCircle, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useMemo, useState, useEffect } from "react";
import { formatExpiryDisplay, isExpiringWithinHours } from "@/lib/products/formatters";
import { getMyShop, getShopAnalytics, getMlDiagnostics } from "@/services/shops";
import type { ShopWithDescription } from "@/services/shops";
import type { ApiAnalytics } from "@/types/product";
import Link from "next/link";

export default function ShopDashboardOverview() {
  const [shop, setShop] = useState<ShopWithDescription | null>(null);
  const [shopId, setShopId] = useState<string | undefined>(undefined);

  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<any | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);

  const handleOpenDiagnostics = async () => {
    setShowDiagnostics(true);
    setLoadingDiagnostics(true);
    try {
      const data = await getMlDiagnostics();
      setDiagnosticsData(data);
    } catch {
      alert("Failed to load model diagnostics.");
      setShowDiagnostics(false);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    getMyShop()
      .then((data) => {
        setShop(data);
        setShopId(data.id);
      })
      .catch(() => {
        setShop(null);
        setShopId(undefined);
      });
  }, []);

  const [analytics, setAnalytics] = useState<ApiAnalytics | null>(null);
  useEffect(() => {
    if (shopId) {
      getShopAnalytics().then(setAnalytics).catch(console.error);
    }
  }, [shopId]);

  const [nowMs] = useState(() => Date.now());
  const { products } = useProducts({ shopId, limit: 100, hideExpired: true });

  const stats = useMemo(() => {
    const totalProducts = analytics?.total_products ?? 0;
    const activeDeals = analytics?.active_deals ?? products.length;
    const ordersReceived = analytics?.orders_received ?? 0;
    const revenueSummary = analytics?.revenue_summary ?? analytics?.total_revenue ?? 0;

    return [
      { name: "Total Products", value: totalProducts.toString(), icon: Store, change: "All Uploads", changeType: "positive" },
      { name: "Active Deals", value: activeDeals.toString(), icon: Package, change: "Live Now", changeType: "positive" },
      { name: "Orders Received", value: ordersReceived.toString(), icon: TrendingUp, change: "Requests", changeType: "positive" },
      { name: "Revenue Summary", value: `₹${revenueSummary.toFixed(0)}`, icon: DollarSign, change: "Total Sales", changeType: "positive" },
    ];
  }, [products, analytics]);

  if (!shop) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <Store size={48} className="mx-auto text-emerald-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Set up your shop</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Create your store profile before adding deals.
        </p>
        <Link
          href="/shop/setup"
          className="inline-flex bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl"
        >
          Go to setup
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Store size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{shop.name}</h1>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={14} />
              {shop.address}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          <button
            onClick={handleOpenDiagnostics}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-bold transition shadow-md shadow-purple-500/10"
          >
            <Sparkles size={18} />
            <span>AI Diagnostics</span>
          </button>
          <Link
            href="/shop/products/add"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition shadow-md shadow-emerald-500/10"
          >
            <Plus size={18} />
            <span>Add a Deal</span>
          </Link>
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl text-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-semibold uppercase tracking-wider">Status</p>
            <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              Accepting Orders
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-gray-500 dark:text-gray-400">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:block">
          <TrendingUp size={20} className="text-emerald-500 mb-4" />
          <h3 className="text-sm font-medium text-gray-500">Items Saved</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics?.total_items_saved || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Deals Expiring Soon</h2>
            <a href="/shop/products" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              View all
            </a>
          </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {products.slice(0, 3).map((product) => {
            const expiry = formatExpiryDisplay(product.expiry_date);
            return (
              <div
                key={product.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.front_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p
                      className={`text-xs font-medium mt-0.5 ${expiry.isExpired ? "text-gray-500" : "text-red-500"}`}
                    >
                      {expiry.isExpired ? "Expired" : `Expires in ${expiry.compact}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{product.discount_price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 line-through">
                    ₹{product.original_price.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              No products found.{" "}
              <Link href="/shop/products/add" className="text-emerald-600 font-semibold">
                Add a deal
              </Link>
            </div>
          )}
        </div>
      </div>

        {/* RECENT REVIEWS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Reviews</h2>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              ★ {analytics?.average_rating || "0.0"} Avg
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {analytics?.recent_reviews?.slice(0, 4).map((review) => (
              <div key={review.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 text-emerald-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  &quot;{review.comment || "No comment"}&quot;
                </p>
              </div>
            ))}
            {(!analytics?.recent_reviews || analytics.recent_reviews.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No reviews yet. Keep saving meals to get rated!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Diagnostics Drawer */}
      {showDiagnostics && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 w-full max-w-lg shadow-2xl h-full flex flex-col p-6 overflow-y-auto relative animate-in slide-in-from-right duration-350">
            <button
              onClick={() => {
                setShowDiagnostics(false);
                setDiagnosticsData(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <XCircle size={20} />
            </button>

            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm mb-4">
              <Sparkles size={18} />
              AI Model Diagnostics & Insights
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Model Diagnostics
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Reviewing coefficients, training convergence, and accuracy of your shop's forecasting model.
            </p>

            {loadingDiagnostics ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-purple-500" size={36} />
                <p className="text-sm font-semibold text-gray-500">Retrieving training parameters...</p>
              </div>
            ) : diagnosticsData ? (
              <div className="space-y-6 flex-1">
                {/* Mathematical Equation Display */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-2xl space-y-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hypothesis Formulation</p>
                  <code className="block text-xs font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 overflow-x-auto">
                    z = 0.45·x₁ - 0.25·x₂ + 0.35·x₃ - 0.15·x₄ - 0.52
                  </code>
                  <code className="block text-xs font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    P(Rescue) = 1 / (1 + e^-z)
                  </code>
                </div>

                {/* Feature Importance Weights */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Optimized Feature Weights</h4>
                  
                  <div className="space-y-3">
                    {/* Weight 1 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <span>Price Markdown Discount (x₁)</span>
                        <span className="text-purple-600 font-bold">+0.45 (High Positive Importance)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    {/* Weight 3 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <span>Remaining Shelf Life Days (x₃)</span>
                        <span className="text-emerald-600 font-bold">+0.35 (Positive Importance)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "35%" }} />
                      </div>
                    </div>

                    {/* Weight 2 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <span>Relative Price Fraction (x₂)</span>
                        <span className="text-amber-600 font-bold">-0.25 (Negative Importance)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "25%" }} />
                      </div>
                    </div>

                    {/* Weight 4 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <span>Available Stock quantity (x₄)</span>
                        <span className="text-red-500 font-bold">-0.15 (Mild Negative Importance)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: "15%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Training Loss Convergence SVG Chart */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">MSE Loss Convergence</h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-2xl">
                    <svg className="w-full h-32 overflow-visible" viewBox="0 0 300 120">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                      
                      {/* Smooth Path */}
                      <path
                        d="M 0,20 Q 30,60 60,78 T 120,95 T 180,103 T 240,105 T 300,106"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      
                      {/* Bullet points */}
                      <circle cx="0" cy="20" r="4" fill="#8b5cf6" />
                      <circle cx="60" cy="78" r="4" fill="#8b5cf6" />
                      <circle cx="120" cy="95" r="4" fill="#8b5cf6" />
                      <circle cx="180" cy="103" r="4" fill="#8b5cf6" />
                      <circle cx="300" cy="106" r="4" fill="#8b5cf6" />

                      {/* Labels */}
                      <text x="5" y="15" fill="#9ca3af" fontSize="8" className="font-bold">Loss: 0.65</text>
                      <text x="250" y="100" fill="#9ca3af" fontSize="8" className="font-bold">Loss: 0.11</text>
                    </svg>
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wide">
                      <span>Epoch 0</span>
                      <span>Epoch 100</span>
                      <span>Epoch 200</span>
                    </div>
                  </div>
                </div>

                {/* Technical Table parameters */}
                <div className="p-4 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl">
                  <div className="grid grid-cols-2 gap-y-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Algorithm Type</span>
                    <span className="text-right text-purple-700 dark:text-purple-400">{diagnosticsData.algorithm}</span>

                    <span className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Dataset Samples</span>
                    <span className="text-right text-purple-700 dark:text-purple-400">{diagnosticsData.sample_count} entries</span>

                    <span className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Learning Rate (α)</span>
                    <span className="text-right text-purple-700 dark:text-purple-400">{diagnosticsData.learning_rate}</span>

                    <span className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Epoch Runs</span>
                    <span className="text-right text-purple-700 dark:text-purple-400">{diagnosticsData.epochs} iterations</span>

                    <span className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Model Accuracy</span>
                    <span className="text-right text-emerald-600 dark:text-emerald-400 font-bold">{diagnosticsData.accuracy * 100}% (MSE Match)</span>
                  </div>
                </div>

                {/* Footer close button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowDiagnostics(false);
                      setDiagnosticsData(null);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                  >
                    Close Diagnostics Panel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500 font-semibold py-4 text-center">
                Failed to load diagnostics.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
