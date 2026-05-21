"use client";

import { MapPin, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";

export type DealProductCardProps = {
  index: number;
  id: string;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  expiryLabel: string;
  expiryIsExpired: boolean;
  shopSubtitle: string;
  quantity: number;
  hasVoiceNote: boolean;
  playingId: string | null;
  onTogglePlay: (id: string, e: React.MouseEvent) => void;
};

export function DealProductCard({
  index,
  id,
  name,
  imageUrl,
  originalPrice,
  discountPrice,
  discountPercent,
  expiryLabel,
  expiryIsExpired,
  shopSubtitle,
  quantity,
  hasVoiceNote,
  playingId,
  onTogglePlay,
}: DealProductCardProps) {
  const isPlaying = playingId === id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex gap-4 p-4"
    >
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h2 className="font-bold text-gray-900 dark:text-white truncate">{name}</h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
            -{discountPercent}%
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
          <MapPin size={12} />
          {shopSubtitle}
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            ₹{discountPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              expiryIsExpired
                ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {expiryLabel}
          </span>
          <span className="text-xs text-gray-500">{quantity} left</span>
        </div>
        {hasVoiceNote && (
          <button
            type="button"
            onClick={(e) => onTogglePlay(id, e)}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            Voice note
          </button>
        )}
      </div>
    </motion.article>
  );
}
