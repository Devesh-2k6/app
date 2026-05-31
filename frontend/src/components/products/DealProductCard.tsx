"use client";

import { MapPin, Pause, Play, Package, Clock, Tag, Heart, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React from "react";
import type { FreshnessInfo, UrgencyBadgeInfo } from "@/lib/products/formatters";
import { getSafeImageUrl } from "@/lib/images";

export type DealProductCardProps = {
  index: number;
  id: string;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountPrice: number;
  currentPrice: number;
  isDynamicPricing: boolean;
  isSurpriseBag: boolean;
  discountPercent: number;
  expiryIsExpired: boolean;
  shopSubtitle: string;
  shopAddress?: string;
  quantity: number;
  hasVoiceNote: boolean;
  playingId: string | null;
  isFavorite?: boolean;
  isFollowing?: boolean;
  shopId?: string;
  // ── New urgency/freshness props ──
  freshness: FreshnessInfo;
  urgencyBadge: UrgencyBadgeInfo | null;
  expiryCountdown: string;
  mfgDate: string;
  expiryDate: string;
  description: string | null;
  distance: number | null;
  onTogglePlay: (id: string, e: React.MouseEvent) => void;
  onReserve?: (id: string) => void;
  onToggleFavorite?: (id: string, isFav: boolean, e: React.MouseEvent) => void;
  onToggleFollow?: (shopId: string, isFollowing: boolean, e: React.MouseEvent) => void;
};

export const DealProductCard = React.memo(function DealProductCardBase({
  index,
  id,
  name,
  imageUrl,
  originalPrice,
  currentPrice,
  isDynamicPricing,
  isSurpriseBag,
  discountPercent,
  expiryIsExpired,
  shopSubtitle,
  shopAddress,
  quantity,
  hasVoiceNote,
  playingId,
  isFavorite = false,
  isFollowing = false,
  shopId,
  freshness,
  urgencyBadge,
  expiryCountdown,
  mfgDate,
  expiryDate,
  description,
  distance,
  onTogglePlay,
  onReserve,
  onToggleFavorite,
  onToggleFollow,
}: DealProductCardProps) {
  const isPlaying = playingId === id;
  const [imgSrc, setImgSrc] = React.useState(() => getSafeImageUrl(imageUrl));

  React.useEffect(() => {
    setImgSrc(getSafeImageUrl(imageUrl));
  }, [imageUrl]);

  // Determine card border glow animation based on freshness
  const borderGlowClass =
    freshness.level === "urgent"
      ? "animate-border-glow-red"
      : freshness.level === "near-expiry"
      ? "animate-border-glow-orange"
      : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`glass-card rounded-3xl ${
        isSurpriseBag
          ? "border-purple-200 shadow-purple-500/20"
          : freshness.level === "urgent" || freshness.level === "near-expiry"
          ? `${freshness.borderColor} ${borderGlowClass}`
          : "border-emerald-100/50"
      } overflow-hidden flex flex-col sm:flex-row gap-4 p-4 ${isDynamicPricing ? "pulse-glow" : ""} relative`}
    >
      {/* ── Urgency Badge (top-left overlay) ── */}
      <AnimatePresence>
        {urgencyBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.05 + 0.15 }}
            className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${urgencyBadge.color} ${urgencyBadge.bgColor} backdrop-blur-md shadow-sm ${
              urgencyBadge.pulse ? "animate-urgency-pulse" : ""
            }`}
          >
            <span className="text-xs leading-none">{urgencyBadge.icon}</span>
            {urgencyBadge.label}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 flex-1">
        {/* ── Image ── */}
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-emerald-100/40 relative">
          <Image 
            src={imgSrc} 
            alt={name} 
            fill 
            sizes="96px" 
            className="object-cover" 
            onError={() => setImgSrc("https://placehold.co/300x300?text=Load+Failed")}
          />
          {isSurpriseBag && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end justify-center pb-1">
              <span className="text-[10px] font-bold text-white flex items-center gap-1">
                <Package size={10} /> Surprise
              </span>
            </div>
          )}

          {/* Freshness dot indicator (bottom-right of image) */}
          <div className="absolute bottom-1.5 right-1.5 z-10">
            <div
              className={`w-2.5 h-2.5 rounded-full ${freshness.dotColor} ring-2 ring-white ${
                freshness.level === "urgent" ? "animate-freshness-breath" : ""
              }`}
              title={freshness.label}
            />
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Row 1: Name + Discount badge + Favorite */}
            <div className="flex justify-between items-start gap-2">
              <h2 className="font-bold text-slate-900 truncate">{name}</h2>
              <div className="flex gap-2 items-center flex-shrink-0">
                {onToggleFavorite && (
                  <button
                    onClick={(e) => onToggleFavorite(id, isFavorite, e)}
                    className="p-1 -m-1 text-slate-400 hover:text-red-500 transition"
                  >
                    <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                  </button>
                )}
                {/* Discount percentage badge */}
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.35 }}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full animate-slide-in-right ${
                    discountPercent >= 50
                      ? "bg-emerald-50 text-emerald-700"
                      : isSurpriseBag
                      ? "bg-purple-50 text-purple-700"
                      : "text-emerald-700 bg-emerald-50"
                  }`}
                >
                  -{discountPercent}%
                </motion.span>
              </div>
            </div>

            {/* Description */}
            {description && (
              <p className="text-xs text-slate-600 mt-1 line-clamp-2" title={description}>
                {description}
              </p>
            )}

            {/* Row 2: Shop name + Freshness label + Follow */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <p className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-full">
                <MapPin size={12} className="text-emerald-600 flex-shrink-0" />
                <span className="font-bold text-slate-800">{shopSubtitle}</span>
                {shopAddress && <span className="text-slate-400 truncate">({shopAddress})</span>}
                {distance !== null && distance !== undefined && (
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {distance.toFixed(1)} km
                  </span>
                )}
              </p>

              {/* Freshness indicator pill */}
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${freshness.color} ${freshness.bgColor}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${freshness.dotColor} ${
                    freshness.level === "urgent" ? "animate-freshness-breath" : ""
                  }`}
                />
                {freshness.label}
              </span>

              {onToggleFollow && shopId && (
                <button
                  onClick={(e) => onToggleFollow(shopId, isFollowing, e)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                    isFollowing
                      ? "bg-slate-100 text-slate-600"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Row 3: Enhanced Price Display */}
          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={currentPrice}
                  initial={{ y: -4, opacity: 0.6 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`text-lg font-extrabold ${
                    isDynamicPricing
                      ? "text-orange-500"
                      : freshness.level === "urgent"
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  ₹{currentPrice.toFixed(2)}
                </motion.span>
                <span className="text-sm text-slate-400 line-through">₹{originalPrice.toFixed(2)}</span>
              </div>
              {isDynamicPricing && (
                <motion.p
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] text-orange-500 font-bold flex items-center gap-0.5 mt-0.5"
                >
                  <TrendingDown size={10} className="animate-price-drop" />
                  Price dropping live!
                </motion.p>
              )}
            </div>

            {/* Savings badge */}
            {discountPercent >= 30 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.25, type: "spring", stiffness: 350, damping: 18 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 whitespace-nowrap"
              >
                Save ₹{(originalPrice - currentPrice).toFixed(0)}
              </motion.div>
            )}
          </div>

          {/* Row 4: MFG date, expiry date, countdown + stock */}
          <div className="flex flex-col gap-1.5 mt-3 pt-2 border-t border-emerald-100/30">
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                MFG: {new Date(mfgDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                EXP: {new Date(expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  expiryIsExpired
                    ? "bg-slate-100 text-slate-500"
                    : freshness.level === "urgent"
                    ? "bg-red-50 text-red-600"
                    : freshness.level === "near-expiry"
                    ? "bg-orange-50 text-orange-600"
                    : isDynamicPricing
                    ? "bg-orange-50 text-orange-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <Clock size={10} /> {expiryCountdown}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold ${
                  quantity <= 3
                    ? "text-red-600 font-bold"
                    : quantity <= 5
                    ? "text-amber-600 font-bold"
                    : "text-slate-500"
                }`}
              >
                {quantity <= 3 ? `Only ${quantity} left!` : `${quantity} left`}
              </span>
            </div>
          </div>

          {hasVoiceNote && (
            <button
              type="button"
              onClick={(e) => onTogglePlay(id, e)}
              className="mt-2 flex w-max items-center gap-1.5 text-xs font-semibold text-emerald-700"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              Voice note
            </button>
          )}
        </div>
      </div>

      {/* Reservation Section */}
      {onReserve && !expiryIsExpired && quantity > 0 && (
        <div className="sm:w-32 flex flex-col justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-emerald-100/40 sm:pl-4">
          <button
            onClick={() => onReserve(id)}
            className={`w-full font-bold text-sm py-2 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
              freshness.level === "urgent"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-950/10 text-white"
            }`}
          >
            <Tag size={14} />
            {freshness.level === "urgent" ? "Grab Now" : "Reserve"}
          </button>
        </div>
      )}
    </motion.article>
  );
}, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.currentPrice === next.currentPrice &&
    prev.quantity === next.quantity &&
    prev.isFavorite === next.isFavorite &&
    prev.isFollowing === next.isFollowing &&
    prev.freshness.level === next.freshness.level &&
    prev.urgencyBadge?.type === next.urgencyBadge?.type &&
    prev.distance === next.distance &&
    prev.description === next.description &&
    (prev.playingId === prev.id) === (next.playingId === next.id)
  );
});

DealProductCard.displayName = "DealProductCard";
