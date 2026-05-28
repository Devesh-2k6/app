"use client";

import { DollarSign, Package, AlertTriangle, TrendingUp, Store, MapPin } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useMemo, useState, useEffect } from "react";
import { formatExpiryDisplay, isExpiringWithinHours } from "@/lib/products/formatters";
import { getMyShop, getShopAnalytics } from "@/services/shops";
import type { ShopWithDescription } from "@/services/shops";
import type { ApiAnalytics } from "@/types/product";
import Link from "next/link";

export default function ShopDashboardOverview() {
  const [shop, setShop] = useState<ShopWithDescription | null>(null);
  const [shopId, setShopId] = useState<string | undefined>(undefined);

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
    const activeDeals = products.length;
    const expiringSoon = products.filter((p) =>
      isExpiringWithinHours(p.expiry_date, 24, nowMs)
    ).length;

    return [
      { name: "Active Deals", value: activeDeals.toString(), icon: Package, change: "+0", changeType: "positive" },
      { name: "Expiring Soon", value: expiringSoon.toString(), icon: AlertTriangle, change: "-0", changeType: "positive" },
      { name: "Total Revenue", value: `₹${(analytics?.total_revenue || 0).toFixed(0)}`, icon: DollarSign, change: "+12%", changeType: "positive" },
    ];
  }, [products, nowMs, analytics]);

  if (!shop) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center mt-12 bg-[#1A1A1A] border border-white/5 rounded-3xl shadow-2xl">
        <Store size={48} className="mx-auto text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Set up your shop</h2>
        <p className="text-gray-400 mb-6 text-sm font-medium">
          Create your store profile before adding deals.
        </p>
        <Link
          href="/shop/setup"
          className="inline-flex bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-black px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
        >
          Go to setup
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <Store size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">{shop.name}</h1>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400 font-medium">
              <MapPin size={14} className="text-gray-500" />
              {shop.address}
            </div>
          </div>
        </div>
        <div className="bg-[#242424] px-4 py-2 rounded-xl text-sm border border-white/5">
          <p className="text-gray-500 mb-0.5 text-[9px] font-black uppercase tracking-widest">Status</p>
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Accepting Orders
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-2xl hover:border-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">{stat.name}</h3>
              <p className="text-3xl font-black text-white mt-1.5 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-2xl hover:border-white/10 transition-all duration-300">
          <TrendingUp size={20} className="text-emerald-400 mb-4" />
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">Items Saved</h3>
          <p className="text-3xl font-black text-white mt-1.5 tracking-tight">{analytics?.total_items_saved || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="text-lg font-bold text-white">Deals Expiring Soon</h2>
            <a href="/shop/products" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              View all
            </a>
          </div>
          <div className="divide-y divide-white/5">
            {products.slice(0, 3).map((product) => {
              const expiry = formatExpiryDisplay(product.expiry_date);
              return (
                <div
                  key={product.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#242424] rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={product.front_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{product.name}</p>
                      <p
                        className={`text-xs font-semibold mt-0.5 ${expiry.isExpired ? "text-gray-500" : "text-red-400"}`}
                      >
                        {expiry.isExpired ? "Expired" : `Expires in ${expiry.compact}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">
                      ₹{product.discount_price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 line-through">
                      ₹{product.original_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-gray-500 font-medium">
                No products found.{" "}
                <Link href="/shop/add" className="text-emerald-400 font-bold hover:underline">
                  Add a deal
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RECENT REVIEWS */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="text-lg font-bold text-white">Recent Reviews</h2>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              ★ {analytics?.average_rating || "0.0"} Avg
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {analytics?.recent_reviews?.slice(0, 4).map((review) => (
              <div key={review.id} className="px-6 py-4 hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 text-emerald-400 font-bold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 italic font-medium">
                  "{review.comment || "No comment"}"
                </p>
              </div>
            ))}
            {(!analytics?.recent_reviews || analytics.recent_reviews.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-gray-500 font-medium">
                No reviews yet. Keep saving meals to get rated!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
