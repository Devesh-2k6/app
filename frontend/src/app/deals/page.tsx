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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto">
          {/* Top row: brand + user */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                <Leaf size={16} />
              </div>
              <div>
                <h1 className="text-base font-black text-gray-900 dark:text-white leading-none">
                  Fresh<span className="text-emerald-500">Save</span>
                </h1>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">Nearby deals</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications bell */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              </Link>

              {user ? (
                /* ── User avatar + dropdown ── */
                <div className="relative" ref={menuRef}>
                  <button
                    id="user-menu-trigger"
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {initial}
                    </div>
                    <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                          Customer
                        </span>
                      </div>

                      {/* Menu items */}
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <User size={16} className="text-gray-500" />
                        View Profile
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <Bell size={16} className="text-gray-500" />
                        Notifications
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700" />

                      {/* Logout */}
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
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
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 px-3 py-2 rounded-full transition"
                >
                  <LogIn size={14} />
                  Sign in
                </Link>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="deals-search"
              type="search"
              placeholder="Search deals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-150 ${
                  activeFilter === f
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
            <button className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <SlidersHorizontal size={12} />
              Filter
            </button>
          </div>
        </div>
      </header>

      {/* ── Map quick-access banner ─────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pt-4 flex gap-2">
        <Link
          href="/map"
          className="flex-1 flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] transition-all"
        >
          <MapPin size={20} className="flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold leading-none">See deals on the map</p>
            <p className="text-xs opacity-80 mt-0.5">Find shops near you</p>
          </div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full hidden sm:block">Open Map →</span>
        </Link>
        <button
          onClick={handleUseLocation}
          className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-emerald-500/30 px-3 py-3 rounded-2xl shadow-sm hover:bg-emerald-50 dark:hover:bg-gray-700 transition flex-shrink-0"
        >
          <MapPin size={18} className="text-emerald-500 mb-0.5" />
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Nearby</span>
        </button>
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="p-4 max-w-2xl mx-auto">
        {status === "loading" && (
          <div className="space-y-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <DealProductSkeleton key={i} />
            ))}
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

        {showEmpty && (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-semibold">No active deals yet.</p>
            <p className="text-sm mt-1">Shops can add deals from the shopkeeper dashboard.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        )}

        {showList && (
          <div className="space-y-4 mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
