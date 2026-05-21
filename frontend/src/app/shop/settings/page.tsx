"use client";

import { useState, useEffect } from "react";
import { Store, MapPin, CheckCircle2, Loader2, Navigation, Save } from "lucide-react";
import { getMyShop, updateShop } from "@/services/shops";
import Map from "@/components/Map";

export default function ShopSettingsPage() {
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getMyShop()
      .then((data) => {
        setShopId(data.id);
        setShopName(data.name || "");
        setAddress(data.address || "");
        setDescription(data.description || "");
        setLatitude(data.latitude ?? null);
        setLongitude(data.longitude ?? null);
      })
      .catch(() => setLoadError("No shop found. Complete setup first."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          alert("Could not get your location. Please grant location permissions.");
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !shopName || !address || latitude === null || longitude === null) {
      alert("Please fill out all required fields and set your location.");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateShop(shopId, {
        name: shopName,
        address,
        description,
        latitude,
        longitude,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (loadError || !shopId) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>{loadError ?? "Shop not found."}</p>
        <a href="/shop/setup" className="mt-4 inline-block text-emerald-600 font-semibold">
          Set up your shop
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your store details and update your map location.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Store size={20} className="text-emerald-500" /> Store Profile
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-emerald-500" /> Location Settings
            </h2>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 font-semibold text-sm transition hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50"
            >
              {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
              Update GPS Coordinates
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
            {latitude !== null && longitude !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Map Preview
                  <span className="ml-2 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </span>
                </label>
                <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                  <Map lat={latitude} lng={longitude} zoom={16} popupText={shopName || "Your Shop"} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <CheckCircle2 size={18} />
              Changes saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3.5 font-bold shadow-lg shadow-emerald-500/20 transition disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
