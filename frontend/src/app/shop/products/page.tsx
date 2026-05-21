"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle2, XCircle, Loader2, Clock, Trash2, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { formatExpiryDisplay } from "@/lib/products/formatters";
import { deleteProduct } from "@/services/products";
import { getMyShop } from "@/services/shops";

export default function ProductList() {
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active");
  const [shopId, setShopId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getMyShop()
      .then((s) => setShopId(s.id))
      .catch(() => setShopId(undefined));
  }, []);

  const { products, status, refetch } = useProducts({
    shopId,
    hideExpired: activeTab === "active",
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
      await deleteProduct(id);
      await refetch();
    } catch {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your deals, update inventory, and view expired items.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="button"
            className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-max mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "active"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          <CheckCircle2 size={16} className={activeTab === "active" ? "text-emerald-500" : ""} />
          Active Deals
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("expired")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "expired"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          <XCircle size={16} className={activeTab === "expired" ? "text-red-500" : ""} />
          Expired Deals
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {status === "loading" ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Expiry Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {products.map((product) => {
                  const expiry = formatExpiryDisplay(product.expiry_date);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.front_image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 dark:border-gray-700"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-white">
                            ₹{product.discount_price.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.original_price.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            expiry.isExpired
                              ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          <Clock size={14} />
                          {expiry.isExpired ? "Expired" : expiry.compact}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {status !== "loading" && products.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p>No products found in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
