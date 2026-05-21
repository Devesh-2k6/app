"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.DivIcon({
  className: "custom-map-marker",
  html: `
    <div style="
      background-color: #10b981; 
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.06);
      position: relative;
      top: -12px;
      left: -12px;
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 });
  }, [lat, lng, zoom, map]);
  return null;
}

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
};

export type MapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
  className?: string;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
};

export default function MapComponent({
  lat,
  lng,
  zoom = 14,
  popupText,
  className = "w-full h-full",
  markers,
  onMarkerClick,
}: MapProps) {
  const points =
    markers && markers.length > 0
      ? markers
      : [{ id: "center", lat, lng, label: popupText ?? "Location" }];

  return (
    <div className={className} style={{ position: "relative", zIndex: 0 }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {points.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={customIcon}
            eventHandlers={
              onMarkerClick
                ? {
                    click: () => onMarkerClick(m),
                  }
                : undefined
            }
          >
            <Popup>
              <span className="font-semibold text-gray-900">{m.label}</span>
            </Popup>
          </Marker>
        ))}
        <RecenterMap lat={lat} lng={lng} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
