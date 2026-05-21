"use client";

import { Heart, Bell, Settings, ChevronLeft, LogOut, PackageCheck, Leaf, Coins } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthenticationContext";
import { BottomNav } from "@/components/BottomNav";
import { getMyFollowing } from "@/services/shops";
import type { ApiFollower } from "@/types/product";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState<ApiFollower[]>([]);

  useEffect(() => {
    if (user) {
      getMyFollowing().then(setFollowing).catch(console.error);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Please log in to view your profile.</p>
        <Link href="/auth?role=customer&tab=login" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  const initial = user.name ? user.name[0].toUpperCase() : "C";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md px-4 py-4 dark:text-white flex items-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold tracking-tight ml-2">My Profile</h1>
      </header>

      <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        
        {/* User Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Food Saver
            </span>
          </div>
        </div>

        {/* Impact Dashboard (Gamification) */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 px-1">My Impact</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center text-center">
              <Coins size={24} className="mb-2 opacity-80" />
              <span className="text-xl font-black">₹{(user as any).total_money_saved?.toFixed(0) || "0"}</span>
              <span className="text-[10px] font-medium opacity-80 uppercase tracking-wide">Saved</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
              <PackageCheck size={24} className="mb-2 text-blue-500" />
              <span className="text-xl font-black text-gray-900 dark:text-white">{(user as any).total_items_saved || "0"}</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Rescued</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
              <Leaf size={24} className="mb-2 text-emerald-500" />
              <span className="text-xl font-black text-gray-900 dark:text-white">{(user as any).co2_saved_kg?.toFixed(1) || "0"}</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">kg CO2</span>
            </div>
          </div>
        </div>

        {/* Followed Shops */}
        {following.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 px-1">Following Shops</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {following.map(f => (
                <div key={f.id} className="snap-start min-w-[140px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                    {f.shop.name[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm truncate w-full">{f.shop.name}</span>
                  <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Heart size={10} className="fill-emerald-500 text-emerald-500" /> Following
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <Link href="/reservations" className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 text-left">
            <div className="flex items-center gap-4">
              <PackageCheck size={20} className="text-emerald-500" />
              <span className="font-semibold text-gray-900 dark:text-white">My Reservations</span>
            </div>
            <ChevronLeft size={16} className="rotate-180 text-gray-400" />
          </Link>
          <Link href="/notifications" className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 text-left">
            <div className="flex items-center gap-4">
              <Bell size={20} className="text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
            </div>
            <ChevronLeft size={16} className="rotate-180 text-gray-400" />
          </Link>
          <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 text-left">
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-gray-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Account Settings</span>
            </div>
            <ChevronLeft size={16} className="rotate-180 text-gray-400" />
          </button>
          
          <button 
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition text-left"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-semibold text-red-600">Log Out</span>
          </button>
        </div>

      </main>
      
      <BottomNav />
    </div>
  );
}
