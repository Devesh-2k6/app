"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Chennai coordinates
const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

// Mock data for live deals
const LIVE_DEALS = [
  { id: 1, pos: [13.0827, 80.2707], name: "Fresh Bakery", discount: "65%" },
  { id: 2, pos: [13.0727, 80.2607], name: "Green Grocers", discount: "50%" },
  { id: 3, pos: [13.0927, 80.2807], name: "City Dairy", discount: "40%" },
  { id: 4, pos: [13.0627, 80.2507], name: "Sweet Tooth", discount: "70%" },
  { id: 5, pos: [13.1027, 80.2907], name: "Veggie Market", discount: "55%" }
];

// Custom pulsing marker icon
const createPulseIcon = () => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-lg"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    // Small delay to ensure container is fully sized before invalidating size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default function HeroMap() {
  const [mounted, setMounted] = useState(false);
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    setMounted(true);
    setIcon(createPulseIcon());
  }, []);

  if (!mounted || !icon) return <div className="w-full h-full bg-emerald-50/50 animate-pulse rounded-3xl"></div>;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-100/50 relative z-10 group">
      <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_40px_rgba(16,185,129,0.05)] z-20" />
      <MapContainer 
        center={CHENNAI_CENTER} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapResizer />
        {/* Light mode map tiles (CartoDB Positron) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {LIVE_DEALS.map((deal) => (
          <Marker key={deal.id} position={deal.pos as [number, number]} icon={icon}>
            <Popup className="custom-popup">
              <div className="text-[#1A1A1A] font-bold">
                <div className="text-emerald-600 text-xs uppercase tracking-widest mb-1">{deal.discount} OFF</div>
                <div className="text-sm">{deal.name}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay to catch clicks and prevent map capturing scroll until clicked */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-100 shadow-lg shadow-emerald-950/5 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Live Deals Map</span>
      </div>
    </div>
  );
}
