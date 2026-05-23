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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/deals" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">My Reservations</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto mt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : reservations.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-semibold">No reservations yet.</p>
            <p className="text-sm mt-1 mb-4">Find nearby deals and reserve them before they're gone!</p>
            <Link href="/deals" className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl">Find Deals</Link>
          </div>
        ) : (
          reservations.map(res => (
            <div key={res.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image src={res.product.front_image_url} alt={res.product.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white">{res.product.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {res.product.shop?.name}</p>
                  
                  <div className="flex justify-between items-end mt-2">
                    <span className="font-bold text-emerald-600">₹{res.total_price.toFixed(2)} <span className="text-xs text-gray-400 font-normal">(x{res.quantity})</span></span>
                    <div className="flex gap-2 items-center">
                      {res.payment_status === "PAID" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">PAID</span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${res.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {res.status === 'COMPLETED' ? <CheckCircle size={10}/> : <Clock size={10}/>} {res.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {res.status === 'PENDING' && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-xs text-gray-500 mb-2">Show this code to the shopkeeper</p>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-xl py-3 px-6 inline-block">
                    <span className="text-3xl font-mono font-black tracking-widest text-gray-900 dark:text-white">{res.pickup_code}</span>
                  </div>
                  {res.payment_status === "UNPAID" && (
                    <div className="mt-4">
                      <Link href={`/checkout/${res.id}`} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center gap-2 py-3 rounded-xl font-bold">
                        <CreditCard size={18} /> Pay Online Now
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {res.status === 'COMPLETED' && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => handleReview(res.shop_id)} className="w-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center gap-2 py-3 rounded-xl font-bold hover:bg-emerald-100 transition">
                    <Star size={18} /> Leave a Review
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
