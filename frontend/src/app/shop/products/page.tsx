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
          <h1 className="text-2xl font-black tracking-tight text-white">Inventory & Deals</h1>
          <p className="mt-1 text-sm text-gray-400 font-medium">
            Manage your deals, update inventory, and view expired items.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <button
            type="button"
            className="p-2.5 bg-[#1A1A1A] border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex bg-[#1A1A1A] border border-white/5 p-1 rounded-xl w-max mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
            activeTab === "active"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              : "text-gray-400 hover:text-white border-transparent"
          }`}
        >
          <CheckCircle2 size={16} className={activeTab === "active" ? "text-emerald-400" : ""} />
          Active Deals
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("expired")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
            activeTab === "expired"
              ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
              : "text-gray-400 hover:text-white border-transparent"
          }`}
        >
          <XCircle size={16} className={activeTab === "expired" ? "text-red-400" : ""} />
          Expired Deals
        </button>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {status === "loading" ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Expiry Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => {
                  const expiry = formatExpiryDisplay(product.expiry_date);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-white/5 transition-all duration-150 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.front_image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                          <span className="font-bold text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-emerald-400 text-sm">
                            ₹{product.discount_price.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ₹{product.original_price.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-300">
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            expiry.isExpired
                              ? "bg-white/5 text-gray-500 border-white/5"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          <Clock size={12} />
                          {expiry.isExpired ? "Expired" : expiry.compact}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
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
            <div className="py-20 text-center text-gray-500">
              <Package size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="font-bold text-white">No products found in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
