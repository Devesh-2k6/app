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
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${
        isSurpriseBag
          ? "border-purple-200 dark:border-purple-900/50 shadow-purple-500/10"
          : "border-gray-100 dark:border-gray-700"
      } shadow-sm overflow-hidden flex flex-col sm:flex-row gap-4 p-4`}
    >
      <div className="flex gap-4 flex-1">
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 relative">
          <Image src={imageUrl} alt={name} fill sizes="96px" className="object-cover" />
          {isSurpriseBag && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end justify-center pb-1">
              <span className="text-[10px] font-bold text-white flex items-center gap-1">
                <Package size={10} /> Surprise
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="font-bold text-gray-900 dark:text-white truncate">{name}</h2>
              <div className="flex gap-2 items-center flex-shrink-0">
                {onToggleFavorite && (
                  <button
                    onClick={(e) => onToggleFavorite(id, isFavorite, e)}
                    className="p-1 -m-1 text-gray-400 hover:text-red-500 transition"
                  >
                    <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                  </button>
                )}
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSurpriseBag
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                      : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                  }`}
                >
                  -{discountPercent}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                <MapPin size={12} />
                {shopSubtitle}
              </p>
              {onToggleFollow && shopId && (
                <button
                  onClick={(e) => onToggleFollow(shopId, isFollowing, e)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                    isFollowing
                      ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                      : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
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
                  className={`text-lg font-extrabold ${
                    isDynamicPricing ? "text-orange-500" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  ₹{currentPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
              </div>
              {isDynamicPricing && (
                <p className="text-[10px] text-orange-500 font-bold flex items-center gap-0.5 mt-0.5 animate-pulse">
                  <ArrowDownRight size={12} /> Price Dropping!
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                expiryIsExpired
                  ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  : isDynamicPricing
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }`}
            >
              <Clock size={10} /> {expiryLabel}
            </span>
            <span className="text-[10px] text-gray-500 font-semibold">{quantity} left</span>
          </div>

          {hasVoiceNote && (
            <button
              type="button"
              onClick={(e) => onTogglePlay(id, e)}
              className="mt-2 flex w-max items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              Voice note
            </button>
          )}
        </div>
      </div>

      {/* Reservation Section */}
      {onReserve && !expiryIsExpired && quantity > 0 && (
        <div className="sm:w-32 flex flex-col justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700 sm:pl-4">
          <button
            onClick={() => onReserve(id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Tag size={14} /> Reserve
          </button>
        </div>
      )}
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
