"use client";

import { MapPin, Pause, Play, Package, Clock, ArrowDownRight, Tag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

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
  expiryLabel: string;
  expiryIsExpired: boolean;
  shopSubtitle: string;
  quantity: number;
  hasVoiceNote: boolean;
  playingId: string | null;
  isFavorite?: boolean;
  isFollowing?: boolean;
  shopId?: string;
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
  discountPrice,
  currentPrice,
  isDynamicPricing,
  isSurpriseBag,
  discountPercent,
  expiryLabel,
  expiryIsExpired,
  shopSubtitle,
  quantity,
  hasVoiceNote,
  playingId,
  isFavorite = false,
  isFollowing = false,
  shopId,
  onTogglePlay,
  onReserve,
  onToggleFavorite,
  onToggleFollow,
}: DealProductCardProps) {
  const isPlaying = playingId === id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`bg-[#1A1A1A] border ${
        isSurpriseBag
          ? "border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
          : "border-white/5"
      } rounded-[2rem] overflow-hidden flex flex-col sm:flex-row gap-4 p-4 transition-all duration-300 hover:border-white/10 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${
        isDynamicPricing ? "pulse-glow" : ""
      }`}
    >
      <div className="flex gap-4 flex-1">
        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 relative bg-[#242424]">
          <Image src={imageUrl} alt={name} fill sizes="96px" className="object-cover" />
          {isSurpriseBag && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 to-transparent flex items-end justify-center pb-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                <Package size={9} /> Surprise
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="font-bold text-white truncate text-base">{name}</h2>
              <div className="flex gap-2 items-center flex-shrink-0">
                {onToggleFavorite && (
                  <button
                    onClick={(e) => onToggleFavorite(id, isFavorite, e)}
                    className="p-1 -m-1 text-gray-500 hover:text-red-400 transition"
                  >
                    <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                  </button>
                )}
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    isSurpriseBag
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  -{discountPercent}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-400 flex items-center gap-1 truncate font-medium">
                <MapPin size={12} className="text-gray-500" />
                {shopSubtitle}
              </p>
              {onToggleFollow && shopId && (
                <button
                  onClick={(e) => onToggleFollow(shopId, isFollowing, e)}
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full transition-all border ${
                    isFollowing
                      ? "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-lg font-black tracking-tight ${
                    isDynamicPricing ? "text-orange-400" : "text-emerald-400"
                  }`}
                >
                  ₹{currentPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
              </div>
              {isDynamicPricing && (
                <p className="text-[9px] text-orange-400 font-bold flex items-center gap-0.5 mt-0.5 animate-pulse">
                  <ArrowDownRight size={10} /> Price Dropping!
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                expiryIsExpired
                  ? "bg-white/5 text-gray-500 border-white/5"
                  : isDynamicPricing
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              <Clock size={10} /> {expiryLabel}
            </span>
            <span className="text-[10px] text-gray-400 font-bold">{quantity} left</span>
          </div>

          {hasVoiceNote && (
            <button
              type="button"
              onClick={(e) => onTogglePlay(id, e)}
              className="mt-2.5 flex w-max items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              Voice note
            </button>
          )}
        </div>
      </div>

      {/* Reservation Section */}
      {onReserve && !expiryIsExpired && quantity > 0 && (
        <div className="sm:w-32 flex flex-col justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-4">
          <button
            onClick={() => onReserve(id)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-extrabold text-sm py-2.5 rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <Tag size={14} /> Reserve
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
    (prev.playingId === prev.id) === (next.playingId === next.id)
  );
});

DealProductCard.displayName = "DealProductCard";
