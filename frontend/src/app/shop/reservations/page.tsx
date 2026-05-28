"use client";

import { useEffect, useState } from "react";
import { getShopReservations, verifyReservation } from "@/services/reservations";
import type { ApiReservation } from "@/types/product";
import { Loader2, CheckCircle, Package, Clock, ShieldCheck, XCircle } from "lucide-react";

export default function ShopReservations() {
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [pickupCode, setPickupCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadReservations = async () => {
    try {
      const data = await getShopReservations();
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

  const handleVerify = async (resId: string) => {
    setError(null);
    setSuccess(null);
    if (!pickupCode || pickupCode.length !== 6) {
      setError("Please enter a valid 6-character pickup code.");
      return;
    }
    setVerifyingId(resId);
    try {
      await verifyReservation(resId, pickupCode);
      setSuccess("Reservation successfully verified! Food handed over.");
      setPickupCode("");
      await loadReservations();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to verify. Invalid code?");
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;
  }

  const pending = reservations.filter(r => r.status === "PENDING");
  const completed = reservations.filter(r => r.status === "COMPLETED");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <Package className="text-emerald-400" /> Verify Pickups
        </h1>
        <p className="mt-1 text-sm text-gray-400 font-medium">Enter the customer's 6-digit code to complete their reservation.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold mb-4 flex items-center gap-2">
          <XCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-bold mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-lg font-black tracking-tight text-white border-b border-white/5 pb-2">Ready for Pickup ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500 italic text-sm font-medium">No pending reservations.</p>
        ) : (
          <div className="grid gap-4">
            {pending.map(res => (
              <div key={res.id} className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-5 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:border-white/10">
                <div className="flex gap-4 items-center">
                  <img src={res.product.front_image_url} alt={res.product.name} className="w-16 h-16 rounded-xl object-cover border border-white/10 bg-[#141414]" />
                  <div>
                    <h3 className="font-bold text-white">{res.product.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {res.quantity} | Total: <span className="font-black text-emerald-400">₹{res.total_price.toFixed(2)}</span></p>
                    <p className="text-[11px] text-amber-500 flex items-center gap-1 mt-1 font-bold"><Clock size={12}/> Reserved {new Date(res.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex w-full sm:w-auto items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="6-digit code" 
                    maxLength={6}
                    value={verifyingId === res.id ? pickupCode : (verifyingId ? "" : pickupCode)}
                    onChange={(e) => {
                      setPickupCode(e.target.value.toUpperCase());
                      if (!verifyingId) setVerifyingId(res.id);
                    }}
                    className="w-full sm:w-40 uppercase bg-[#141414] border border-white/5 rounded-xl px-3 py-2.5 text-center font-mono font-black text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                  <button 
                    onClick={() => handleVerify(res.id)}
                    disabled={verifyingId === res.id && !pickupCode}
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#111111] px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {verifyingId === res.id && loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-black tracking-tight text-white border-b border-white/5 pb-2 mt-8">Completed Today ({completed.length})</h2>
        <div className="grid gap-3">
          {completed.slice(0, 5).map(res => (
            <div key={res.id} className="bg-[#1A1A1A]/60 border border-white/5 rounded-xl p-4 flex justify-between items-center opacity-70 hover:opacity-100 transition-all duration-200">
              <div>
                <h3 className="font-bold text-gray-300">{res.product.name} (x{res.quantity})</h3>
                <p className="text-xs text-gray-500">Completed at {new Date(res.created_at).toLocaleTimeString()}</p>
              </div>
              <CheckCircle className="text-emerald-400" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
