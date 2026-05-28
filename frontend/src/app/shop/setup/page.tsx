"use client";

import { useState, useEffect } from "react";
import { getMyShop } from "@/services/shops";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store, MapPin, CheckCircle2, Loader2, Navigation, Info, ShoppingBag } from "lucide-react";
import Map from "@/components/Map";
import { createShop } from "@/services/shops";

export default function ShopSetupPage() {
  const router = useRouter();
  
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("grocery");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Shop type options
  useEffect(() => {
    getMyShop()
      .then(() => router.replace("/shop"))
      .catch(() => {});
  }, [router]);

  const shopTypes = [
    { id: "grocery", label: "Grocery Store", icon: ShoppingBag },
    { id: "bakery", label: "Bakery", icon: Store },
    { id: "cafe", label: "Cafe", icon: Store },
    { id: "supermarket", label: "Supermarket", icon: Store },
  ];

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          alert("Could not get your location. Please ensure you have granted location permissions.");
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // start submitting
    setIsSubmitting(true);
    // Validate
    if (!shopName || !address) {
      alert("Please fill out the required fields.");
      setIsSubmitting(false);
      return;
    }
    try {
      await createShop({
        name: shopName,
        address: address,
        description: description,
        latitude: latitude || 0,
        longitude: longitude || 0,
      });
      setIsSuccess(true);
      // redirect after success animation
      setTimeout(() => {
        router.push("/shop");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to create shop. You may already have one.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A1A1A]/80 border border-white/5 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 size={80} className="text-emerald-400 mb-6" />
          </motion.div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2">Shop Created!</h2>
          <p className="text-sm text-gray-400 font-medium">
            Welcome to ExpiryGo, {shopName}. Let&apos;s start saving food.
          </p>
          <Loader2 size={24} className="animate-spin text-emerald-400 mt-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-xl w-full mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Store size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Setup Your Shop</h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">Tell us about your business so customers can find you.</p>
        </div>

        <motion.div 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="bg-[#1A1A1A]/80 border border-white/5 shadow-2xl backdrop-blur-3xl p-6 sm:p-10 rounded-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Basic Info */}
            <div className="space-y-5">
              <h3 className="text-lg font-black tracking-tight text-white border-b border-white/5 pb-3">Basic Details</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Shop Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Green Valley Market" 
                  className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Shop Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {shopTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = shopType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setShopType(type.id)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 ${
                          isSelected 
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                            : "border-white/5 bg-[#141414] hover:border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-bold">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What kind of products do you usually sell?" 
                  rows={3}
                  className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Step 2: Location */}
            <div className="space-y-5">
              <h3 className="text-lg font-black tracking-tight text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-400" /> Location
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Street Address <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City" 
                  className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-400 mb-4 font-medium">
                      We need your exact coordinates so customers can find your deals on the map.
                    </p>
                    <button 
                      type="button" 
                      onClick={handleGetLocation}
                      disabled={isLocating || (latitude !== null && longitude !== null)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/25 text-blue-400 border border-blue-500/20 rounded-xl px-4 py-2.5 font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {isLocating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : latitude !== null ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <Navigation size={16} />
                      )}
                      {latitude !== null ? "Location Saved" : "Get Current Location"}
                    </button>
                    {latitude !== null && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <p className="text-xs text-blue-400/80 mb-2 font-mono font-bold">
                          {latitude.toFixed(4)}, {longitude?.toFixed(4)}
                        </p>
                        <div className="h-48 w-full rounded-xl overflow-hidden border border-white/5 shadow-2xl relative mt-3">
                          <Map lat={latitude} lng={longitude ?? 0} zoom={15} popupText={shopName || "Your Shop Location"} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] rounded-xl py-4 font-black text-base tracking-wider uppercase shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Shop...
                </>
              ) : (
                "Complete Setup"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
