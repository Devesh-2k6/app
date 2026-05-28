"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getMyReservations } from "@/services/reservations";
import type { ApiReservation } from "@/types/product";
import { Loader2, Package, MapPin, CheckCircle, Clock, ArrowLeft, CreditCard, Star } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { leaveReview } from "@/services/shops";

export default function MyReservations() {
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleReview = async (shopId: string) => {
    const ratingStr = window.prompt("Rate the shop from 1 to 5 stars:");
    if (!ratingStr) return;
    const rating = parseInt(ratingStr);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert("Invalid rating");
      return;
    }
    const comment = window.prompt("Any comments? (optional)") || undefined;
    try {
      await leaveReview(shopId, rating, comment);
      alert("Review submitted successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <header className="sticky top-0 z-30 bg-[#161616]/80 backdrop-blur-3xl border-b border-white/5 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/deals" className="p-2.5 -ml-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-black tracking-tight text-white">My Reservations</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto mt-4 space-y-4 relative z-10">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-400" size={32} /></div>
        ) : reservations.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Package size={48} className="mx-auto text-gray-600 mb-3" />
            <p className="font-bold text-white text-base">No reservations yet.</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Find nearby deals and reserve them before they're gone!</p>
            <Link href="/deals" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-black px-6 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/10">Find Deals</Link>
          </div>
        ) : (
          reservations.map(res => (
            <div key={res.id} className="bg-[#1A1A1A] rounded-2xl border border-white/5 shadow-2xl p-4 transition-all duration-300 hover:border-white/10">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10">
                  <Image src={res.product.front_image_url} alt={res.product.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white">{res.product.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={12} className="text-emerald-400" /> {res.product.shop?.name}</p>
                  
                  <div className="flex justify-between items-end mt-2">
                    <span className="font-bold text-emerald-400">₹{res.total_price.toFixed(2)} <span className="text-xs text-gray-500 font-bold">(x{res.quantity})</span></span>
                    <div className="flex gap-2 items-center">
                      {res.payment_status === "PAID" && (
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PAID</span>
                      )}
                      <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                        res.status === 'COMPLETED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {res.status === 'COMPLETED' ? <CheckCircle size={10}/> : <Clock size={10}/>} {res.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {res.status === 'PENDING' && (
                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                  <p className="text-xs text-gray-500 font-bold mb-2">Show this code to the shopkeeper</p>
                  <div className="bg-[#141414] border border-white/5 rounded-xl py-3 px-6 inline-block">
                    <span className="text-3xl font-mono font-black tracking-widest text-white">{res.pickup_code}</span>
                  </div>
                  {res.payment_status === "UNPAID" && (
                    <div className="mt-4">
                      <Link href={`/checkout/${res.id}`} className="w-full bg-white hover:bg-white/90 text-[#111111] flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all">
                        <CreditCard size={18} /> Pay Online Now
                      </Link>
                    </div>
                  )}
                </div>
              )}
 
              {res.status === 'COMPLETED' && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button onClick={() => handleReview(res.shop_id)} className="w-full bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all">
                    <Star size={18} className="fill-current" /> Leave a Review
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </main>
 
      <BottomNav />
    </div>
  );
}
