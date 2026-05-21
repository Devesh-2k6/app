"use client";

import { DollarSign, Package, AlertTriangle, TrendingUp, Store, MapPin } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useMemo, useState, useEffect } from "react";
import { formatExpiryDisplay } from "@/lib/products/formatters";
import { getMyShop } from "@/services/shops";
import type { ShopWithDescription } from "@/services/shops";
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

  const { products } = useProducts({ shopId, limit: 100, hideExpired: true });

  const stats = useMemo(() => {
    const activeDeals = products.length;
    const revenueSaved = products.reduce(
      (acc, p) => acc + (p.original_price - p.discount_price),
      0
    );
    const expiringSoon = products.filter((p) => {
      const t = new Date(p.expiry_date).getTime() - Date.now();
      return t < 24 * 3600 * 1000 && t > 0;
    }).length;

    return [
      { name: "Active Deals", value: activeDeals.toString(), icon: Package, change: "+0", changeType: "positive" },
      { name: "Expiring Soon", value: expiringSoon.toString(), icon: AlertTriangle, change: "-0", changeType: "positive" },
      { name: "Total Savings", value: `₹${revenueSaved.toFixed(0)}`, icon: TrendingUp, change: "0%", changeType: "positive" },
    ];
  }, [products]);

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
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl text-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-semibold uppercase tracking-wider">Status</p>
          <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            Accepting Orders
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hidden lg:block">
          <DollarSign size={20} className="text-gray-400 mb-4" />
          <h3 className="text-sm font-medium text-gray-500">Revenue (demo)</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">—</p>
        </div>
      </div>

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
              <Link href="/shop/add" className="text-emerald-600 font-semibold">
                Add a deal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
