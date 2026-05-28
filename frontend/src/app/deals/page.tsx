"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogIn,
  MapPin,
  Package,
  RefreshCw,
  Search,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Leaf,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthenticationContext";
import { DealProductCard } from "@/components/products/DealProductCard";
import { DealProductSkeleton } from "@/components/products/DealProductSkeleton";
import { getErrorMessage } from "@/api/errors";
import { useProducts } from "@/hooks/useProducts";
import { buildDealProductCardProps } from "@/lib/products/map-deal-product";
import { createReservation } from "@/services/reservations";
import { addFavorite, removeFavorite, getFavorites } from "@/services/products";
import { getMyFollowing, followShop, unfollowShop } from "@/services/shops";
import { BottomNav } from "@/components/BottomNav";
import type { ProductCategory } from "@/types/product";

const FILTERS = ["All", "BAKERY", "DAIRY", "PRODUCE", "MEAT", "PANTRY", "PREPARED_FOOD", "OTHER"];

export default function CustomerDealsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const { products, status, errorMessage, refetch } = useProducts({ 
    hideExpired: true,
    q: search || undefined,
    category: activeFilter === "All" ? undefined : (activeFilter as ProductCategory),
    lat,
    lng,
    radius_km: lat ? 50 : undefined
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch favorites on load
  useEffect(() => {
    if (user) {
      getFavorites().then(favs => {
        setFavorites(new Set(favs.map(f => f.product_id)));
      }).catch(console.error);
      
      getMyFollowing().then(fols => {
        setFollowing(new Set(fols.map(f => f.shop_id)));
      }).catch(console.error);
    }
  }, [user]);

  const handleToggleFavorite = async (id: string, isFav: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth?role=customer&tab=login");
      return;
    }
    try {
      if (isFav) {
        await removeFavorite(id);
        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await addFavorite(id);
        setFavorites(prev => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to update favorites.");
    }
  };

  const handleToggleFollow = async (shopId: string, isFollowing: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth?role=customer&tab=login");
      return;
    }
    try {
      if (isFollowing) {
        await unfollowShop(shopId);
        setFollowing(prev => {
          const next = new Set(prev);
          next.delete(shopId);
          return next;
        });
      } else {
        await followShop(shopId);
        setFollowing(prev => {
          const next = new Set(prev);
          next.add(shopId);
          return next;
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to update following.");
    }
  };

  const handleTogglePlay = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleReserve = async (productId: string) => {
    if (!user) {
      router.push("/auth?role=customer&tab=login");
      return;
    }
    
    try {
      await createReservation(productId, 1); // defaulting to quantity 1 for simple 1-click reserve
      alert("Item reserved successfully! View your reservations in your Profile.");
      refetch(); // Refresh list to show updated quantities
    } catch (err: any) {
      alert(err.message || "Failed to reserve item.");
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        (err) => alert("Could not get location. " + err.message)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const filteredProducts = products; // Backend already handles search/category filters

  const showList = status === "success" && filteredProducts.length > 0;
  const showEmpty =
    (status === "empty" || (status === "success" && filteredProducts.length === 0));

  const initial = user?.name ? user.name[0].toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-[#111111] text-white pb-32 overflow-x-hidden relative">
      {/* Ambient Parallax Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[100vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-20 w-[60vw] h-[60vw] min-w-[300px] min-h-[300px] bg-emerald-500/10 rounded-full blur-[110px]" />
        <div className="absolute top-[20%] -right-20 w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-amber-500/5 rounded-full blur-[130px]" />
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#161616]/80 backdrop-blur-3xl border-b border-white/5 px-4 pt-4 pb-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-2xl mx-auto">
          {/* Top row: brand + user */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Leaf size={16} className="fill-white text-white" />
              </div>
              <div>
                <h1 className="text-base font-black text-white leading-none tracking-tight">
                  Expiry<span className="text-emerald-500">Go</span>
                </h1>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Nearby deals</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications bell */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition text-gray-300 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </Link>

              {user ? (
                /* ── User avatar + dropdown ── */
                <div className="relative" ref={menuRef}>
                  <button
                    id="user-menu-trigger"
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-full transition text-white"
                    aria-label="User menu"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[#111111] font-black text-xs">
                      {initial}
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Customer
                        </span>
                      </div>

                      {/* Menu items */}
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <User size={16} className="text-gray-400" />
                        View Profile
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <Bell size={16} className="text-gray-400" />
                        Notifications
                      </Link>

                      <div className="border-t border-white/5" />

                      {/* Logout */}
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Sign-in link ── */
                <Link
                  href="/auth?role=customer&tab=login"
                  className="flex items-center gap-1.5 text-xs font-black text-[#111111] bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <LogIn size={14} />
                  Sign in
                </Link>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="deals-search"
              type="search"
              placeholder="Search deals by product name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-150 border ${
                  activeFilter === f
                    ? "bg-emerald-505 text-[#111111] bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-black"
                    : "bg-[#1A1A1A] text-gray-400 border-white/5 hover:text-white hover:border-white/10"
                }`}
              >
                {f}
              </button>
            ))}
            <button className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#1A1A1A] text-gray-400 border border-white/5 hover:text-white hover:border-white/10 transition">
              <SlidersHorizontal size={12} />
              Filter
            </button>
          </div>
        </div>
      </header>

      {/* ── Map quick-access banner ─────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pt-4 flex gap-2 relative z-10">
        <Link
          href="/map"
          className="flex-1 flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-white px-4 py-3 rounded-2xl shadow-lg shadow-black/30 hover:scale-[1.01] transition-all duration-300"
        >
          <MapPin size={20} className="flex-shrink-0 text-emerald-400" />
          <div className="flex-1">
            <p className="text-sm font-bold leading-none">See deals on the map</p>
            <p className="text-xs text-gray-400 mt-0.5">Find shops near you</p>
          </div>
          <span className="text-xs font-bold bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full hidden sm:block">Open Map →</span>
        </Link>
        <button
          onClick={handleUseLocation}
          className="flex flex-col items-center justify-center bg-[#1A1A1A] border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 px-3 py-3 rounded-2xl shadow-sm transition flex-shrink-0"
        >
          <MapPin size={18} className="text-emerald-400 mb-0.5" />
          <span className="text-[10px] font-bold text-emerald-400">Nearby</span>
        </button>
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="p-4 max-w-2xl mx-auto relative z-10">
        {status === "loading" && (
          <div className="space-y-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <DealProductSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="py-16 text-center px-6 bg-[#1A1A1A] border border-white/5 rounded-3xl mt-4">
            <p className="text-red-400 text-sm font-bold mb-4">
              {errorMessage ?? getErrorMessage(new Error("Failed to load deals"))}
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Make sure the API is running:{" "}
              <code className="bg-black/50 px-2 py-1 rounded border border-white/5">uvicorn main:app --port 8000</code>
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 bg-emerald-500 text-[#111111] font-extrabold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {showEmpty && (
          <div className="py-20 text-center text-gray-400 bg-[#1A1A1A] border border-white/5 rounded-3xl mt-4">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="font-extrabold text-white">No active deals yet.</p>
            <p className="text-sm mt-1 text-gray-500">Shops can add deals from the shopkeeper dashboard.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 inline-flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all duration-300"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        )}

        {showList && (
          <div className="space-y-4 mt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {filteredProducts.length} deal{filteredProducts.length !== 1 ? "s" : ""} available
            </p>
            {filteredProducts.map((product, index) => (
              <DealProductCard
                key={product.id}
                {...buildDealProductCardProps(product, index, playingId, handleTogglePlay, handleReserve)}
                isFavorite={favorites.has(product.id)}
                isFollowing={following.has(product.shop_id)}
                onToggleFavorite={handleToggleFavorite}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
