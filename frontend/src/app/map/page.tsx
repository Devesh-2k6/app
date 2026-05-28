"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Filter, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import { getErrorMessage } from "@/api/errors";
import type { MapMarker } from "@/components/MapComponent";
import { listShops, type ShopWithDescription } from "@/services/shops";
import { getProducts } from "@/services/products";
import type { ApiProduct } from "@/types/product";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin size={32} className="text-emerald-500 mb-2" />
        <p className="text-gray-500 font-medium text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

const FALLBACK_CENTER: [number, number] = [20.5937, 78.9629];

type SelectedShop = ShopWithDescription & { deals: ApiProduct[] };

export default function MapDiscovery() {
  const [shops, setShops] = useState<ShopWithDescription[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<SelectedShop | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const [shopList, productList] = await Promise.all([
        listShops(),
        getProducts({ hideExpired: true }),
      ]);
      setShops(shopList);
      setProducts(productList);
      setStatus("ready");
    } catch (e) {
      setErrorMessage(getErrorMessage(e));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredShops = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [shops, search]);

  const mapCenter = useMemo((): [number, number] => {
    if (filteredShops.length > 0) {
      const lat =
        filteredShops.reduce((sum, s) => sum + s.latitude, 0) / filteredShops.length;
      const lng =
        filteredShops.reduce((sum, s) => sum + s.longitude, 0) / filteredShops.length;
      return [lat, lng];
    }
    return FALLBACK_CENTER;
  }, [filteredShops]);

  const mapMarkers: MapMarker[] = useMemo(
    () =>
      filteredShops.map((s) => ({
        id: s.id,
        lat: s.latitude,
        lng: s.longitude,
        label: s.name,
      })),
    [filteredShops]
  );

  const handleMarkerClick = (marker: MapMarker) => {
    const shop = shops.find((s) => s.id === marker.id);
    if (!shop) return;
    const deals = products.filter((p) => p.shop_id === shop.id);
    setSelectedShop({ ...shop, deals });
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#111111] text-white">
      <div className="absolute top-0 inset-x-0 z-[400] p-4 pt-safe flex items-center gap-3 pointer-events-none">
        <Link
          href="/deals"
          className="bg-[#1A1A1A]/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/5 transition hover:scale-105 pointer-events-auto text-white hover:border-white/10"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 bg-[#1A1A1A]/90 backdrop-blur-md rounded-full shadow-lg border border-white/5 flex items-center px-4 py-3 pointer-events-auto focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shops..."
            className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder-gray-500"
          />
        </div>
        <button
          type="button"
          className="bg-[#1A1A1A]/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/5 transition hover:scale-105 pointer-events-auto text-white hover:border-white/10"
          aria-label="Filters"
        >
          <Filter size={20} />
        </button>
      </div>

      <div className="absolute inset-0 z-0">
        {status === "loading" ? (
          <div className="w-full h-full flex items-center justify-center bg-[#111111]">
            <Loader2 className="animate-spin text-emerald-500" size={36} />
          </div>
        ) : status === "error" ? (
          <div className="w-full h-full flex items-center justify-center px-6 text-center text-red-400 text-sm font-bold bg-[#111111]">
            {errorMessage}
          </div>
        ) : (
          <MapComponent
            lat={mapCenter[0]}
            lng={mapCenter[1]}
            zoom={filteredShops.length === 1 ? 15 : 12}
            markers={mapMarkers}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedShop && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-[450]"
              onClick={() => setSelectedShop(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 z-[500] bg-[#161616]/95 backdrop-blur-3xl rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5 p-6 pb-safe max-h-[55vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {selectedShop.name}
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm font-medium">
                    {selectedShop.address}
                  </p>
                </div>
                <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
                  {selectedShop.deals.length || selectedShop.deal_count || 0} Deals
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                {selectedShop.deals.slice(0, 8).map((p) => (
                  <div
                    key={p.id}
                    className="min-w-[140px] bg-[#242424] rounded-2xl p-3 border border-white/5 flex-shrink-0"
                  >
                    <div className="h-20 w-full bg-[#1A1A1A] rounded-xl mb-3 overflow-hidden relative border border-white/5">
                      <Image
                        src={p.front_image_url}
                        alt={p.name}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-1">
                      {p.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-emerald-400">
                        ₹{p.discount_price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-500 line-through">
                        ₹{p.original_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                {selectedShop.deals.length === 0 && (
                  <p className="text-sm text-gray-500 py-4 font-medium pl-6">No active deals at this shop.</p>
                )}
              </div>
              <Link
                href="/deals"
                className="block w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-black py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 text-center"
              >
                Browse all deals
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
