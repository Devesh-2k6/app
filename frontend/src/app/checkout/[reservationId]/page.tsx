"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMyReservations, checkoutReservation } from "@/services/reservations";
import type { ApiReservation } from "@/types/product";

export default function CheckoutPage({ params }: { params: { reservationId: string } }) {
  const router = useRouter();
  const [reservation, setReservation] = useState<ApiReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMyReservations().then(res => {
      const found = res.find(r => r.id === params.reservationId);
      if (found) setReservation(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.reservationId]);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    try {
      await checkoutReservation(params.reservationId);
      setSuccess(true);
      setTimeout(() => {
        router.push("/reservations");
      }, 2000);
    } catch (err: any) {
      alert("Payment failed: " + err.message);
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;
  if (!reservation) return <div className="min-h-screen flex items-center justify-center">Reservation not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {success ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">Redirecting you to your reservations...</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
              <Link href="/reservations" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold">Checkout</h1>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <img src={reservation.product.front_image_url} className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{reservation.product.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {reservation.quantity}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-bold text-emerald-600">₹{reservation.total_price.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Payment Method</h3>
                <div className="p-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center gap-3">
                  <CreditCard className="text-emerald-600" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Credit Card</p>
                    <p className="text-xs text-gray-500">**** **** **** 4242</p>
                  </div>
                  <div className="ml-auto w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-200" />
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-70"
              >
                {processing ? <Loader2 className="animate-spin" size={20} /> : null}
                {processing ? "Processing..." : `Pay ₹${reservation.total_price.toFixed(2)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
