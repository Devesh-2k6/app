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

  useEffect(() => {
    loadReservations();
  }, []);

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
    } catch (err: any) {
      setError(err.message || "Failed to verify. Invalid code?");
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="text-emerald-500" /> Verify Pickups
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter the customer's 6-digit code to complete their reservation.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-4 flex items-center gap-2"><XCircle size={18}/>{error}</div>}
      {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium mb-4 flex items-center gap-2"><CheckCircle size={18}/>{success}</div>}

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Ready for Pickup ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No pending reservations.</p>
        ) : (
          <div className="grid gap-4">
            {pending.map(res => (
              <div key={res.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4 items-center">
                  <img src={res.product.front_image_url} alt={res.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{res.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {res.quantity} | Total: <span className="font-bold text-emerald-600">₹{res.total_price.toFixed(2)}</span></p>
                    <p className="text-xs text-orange-500 flex items-center gap-1 mt-1"><Clock size={12}/> Reserved {new Date(res.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex w-full sm:w-auto items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code" 
                    maxLength={6}
                    value={verifyingId === res.id ? pickupCode : (verifyingId ? "" : pickupCode)}
                    onChange={(e) => {
                      setPickupCode(e.target.value.toUpperCase());
                      if (!verifyingId) setVerifyingId(res.id);
                    }}
                    className="w-full sm:w-40 uppercase bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-center font-mono font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <button 
                    onClick={() => handleVerify(res.id)}
                    disabled={verifyingId === res.id && !pickupCode}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {verifyingId === res.id && loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b pb-2 mt-8">Completed Today ({completed.length})</h2>
        <div className="grid gap-3">
          {completed.slice(0, 5).map(res => (
            <div key={res.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex justify-between items-center opacity-70">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">{res.product.name} (x{res.quantity})</h3>
                <p className="text-xs text-gray-500">Completed at {new Date(res.created_at).toLocaleTimeString()}</p>
              </div>
              <CheckCircle className="text-emerald-500" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
