'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet's default icon paths issue with Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A custom pulsing icon for trucks
const truckIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse flex items-center justify-center"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// A custom icon for Bins based on status
const createBinIcon = (fillLevel: number) => {
  let color = 'bg-brand-success'; // Green
  if (fillLevel > 85) color = 'bg-brand-danger'; // Red
  else if (fillLevel > 60) color = 'bg-brand-warning'; // Yellow

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="relative group">
            <div class="w-5 h-5 ${color} rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110"></div>
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface BinLoc {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number;
  lastUpdated: string;
}

interface TruckLoc {
  id: string;
  lat: number;
  lng: number;
  driverName: string;
}

export default function LiveMap() {
  const [bins, setBins] = useState<BinLoc[]>([]);
  const [trucks, setTrucks] = useState<TruckLoc[]>([]);

  // Simulation of Live Data fetching / Ably WebSockets would go here.
  useEffect(() => {
    // For now we will populate the map with some simulated locations near Mira-Bhayandar
    setBins([
      { id: '1', lat: 19.281, lng: 72.855, fillLevel: 45, lastUpdated: '2 mins ago' },
      { id: '2', lat: 19.288, lng: 72.859, fillLevel: 92, lastUpdated: '1 min ago' },
      { id: '3', lat: 19.295, lng: 72.851, fillLevel: 65, lastUpdated: '5 mins ago' },
      { id: '4', lat: 19.278, lng: 72.862, fillLevel: 10, lastUpdated: '10 mins ago' },
      { id: '5', lat: 19.284, lng: 72.848, fillLevel: 88, lastUpdated: 'Just now' },
    ]);

    setTrucks([
      { id: 't1', lat: 19.285, lng: 72.856, driverName: 'Pradeep K.' },
      { id: 't2', lat: 19.290, lng: 72.852, driverName: 'Ajay S.' },
    ]);

    // Intermittent mock update to simulate live movement
    const interval = setInterval(() => {
      setTrucks((prev) => 
        prev.map(t => ({
          ...t,
          lat: t.lat + (Math.random() - 0.5) * 0.002,
          lng: t.lng + (Math.random() - 0.5) * 0.002,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-inner z-0">
      <MapContainer 
        center={[19.285, 72.855]} 
        zoom={14} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Bins */}
        {bins.map((bin) => (
          <Marker 
            key={`bin-${bin.id}`} 
            position={[bin.lat, bin.lng]} 
            icon={createBinIcon(bin.fillLevel)}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1">
                <p className="font-bold text-gray-800 text-sm mb-1">Smart Bin #{bin.id}</p>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
                   <div 
                      className={`h-full rounded-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${bin.fillLevel}%` }} 
                   />
                </div>
                <p className="text-xs text-gray-500">{bin.fillLevel}% Full • {bin.lastUpdated}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Trucks */}
        {trucks.map((truck) => (
          <Marker 
            key={`truck-${truck.id}`} 
            position={[truck.lat, truck.lng]} 
            icon={truckIcon}
          >
            <Popup className="rounded-xl overflow-hidden">
               <div className="p-1 flex items-center gap-2">
                 <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                    <Navigation size={14} className="fill-blue-600"/>
                 </div>
                 <div>
                    <p className="font-bold text-gray-800 text-sm">{truck.driverName}</p>
                    <p className="text-xs text-gray-500">Live Location</p>
                 </div>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Overlay Controls overlay */}
      <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
        <div className="glass px-3 py-2 rounded-lg border border-white/20 shadow-md flex items-center gap-2 text-xs font-semibold backdrop-blur-md bg-white/60 dark:bg-black/40">
           <div className="w-2.5 h-2.5 rounded-full bg-brand-danger animate-pulse" />
           {bins.filter(b => b.fillLevel > 80).length} Critical
        </div>
        <div className="glass px-3 py-2 rounded-lg border border-white/20 shadow-md flex items-center gap-2 text-xs font-semibold backdrop-blur-md bg-white/60 dark:bg-black/40">
           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
           {trucks.length} Active
        </div>
      </div>
    </div>
  );
}
