'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Truck, User, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A custom pulsing icon for trucks
const createTruckIcon = (id: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
            <div class="relative w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// A custom icon for Bins based on status
const createBinIcon = (fillLevel: number) => {
  let color = 'bg-brand-success'; // Green
  if (fillLevel > 85) color = 'bg-brand-danger'; // Red
  else if (fillLevel > 60) color = 'bg-brand-warning'; // Yellow

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="relative group">
            <div class="w-6 h-6 ${color} rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-125 cursor-pointer">
               <div class="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
            </div>
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
  const [selectedTruck, setSelectedTruck] = useState<TruckLoc | null>(null);

  useEffect(() => {
    setBins([
      { id: '1', lat: 19.281, lng: 72.855, fillLevel: 45, lastUpdated: '2 mins ago' },
      { id: '2', lat: 19.288, lng: 72.859, fillLevel: 92, lastUpdated: '1 min ago' },
      { id: '3', lat: 19.295, lng: 72.851, fillLevel: 65, lastUpdated: '5 mins ago' },
      { id: '4', lat: 19.278, lng: 72.862, fillLevel: 10, lastUpdated: '10 mins ago' },
      { id: '5', lat: 19.284, lng: 72.848, fillLevel: 88, lastUpdated: 'Just now' },
      { id: '6', lat: 19.272, lng: 72.852, fillLevel: 30, lastUpdated: '8 mins ago' },
      { id: '7', lat: 19.286, lng: 72.865, fillLevel: 75, lastUpdated: '3 mins ago' },
      { id: '8', lat: 19.291, lng: 72.845, fillLevel: 12, lastUpdated: '12 mins ago' },
      { id: '9', lat: 19.275, lng: 72.858, fillLevel: 82, lastUpdated: '4 mins ago' },
      { id: '10', lat: 19.283, lng: 72.861, fillLevel: 55, lastUpdated: '7 mins ago' },
      { id: '11', lat: 19.289, lng: 72.849, fillLevel: 98, lastUpdated: '1 min ago' },
      { id: '12', lat: 19.280, lng: 72.853, fillLevel: 25, lastUpdated: '15 mins ago' },
      { id: '13', lat: 19.293, lng: 72.857, fillLevel: 40, lastUpdated: '6 mins ago' },
      { id: '14', lat: 19.277, lng: 72.847, fillLevel: 60, lastUpdated: '9 mins ago' },
      { id: '15', lat: 19.285, lng: 72.863, fillLevel: 18, lastUpdated: '11 mins ago' },
      { id: '16', lat: 19.292, lng: 72.850, fillLevel: 33, lastUpdated: '4 mins ago' },
      { id: '17', lat: 19.287, lng: 72.842, fillLevel: 77, lastUpdated: '2 mins ago' },
      { id: '18', lat: 19.274, lng: 72.868, fillLevel: 15, lastUpdated: '14 mins ago' },
      { id: '19', lat: 19.282, lng: 72.870, fillLevel: 89, lastUpdated: 'Just now' },
      { id: '20', lat: 19.298, lng: 72.855, fillLevel: 22, lastUpdated: '9 mins ago' },
      { id: '21', lat: 19.270, lng: 72.850, fillLevel: 61, lastUpdated: '3 mins ago' },
      { id: '22', lat: 19.285, lng: 72.840, fillLevel: 44, lastUpdated: '12 mins ago' },
      { id: '23', lat: 19.290, lng: 72.865, fillLevel: 91, lastUpdated: '1 min ago' },
      { id: '24', lat: 19.276, lng: 72.845, fillLevel: 5, lastUpdated: '20 mins ago' },
      { id: '25', lat: 19.283, lng: 72.852, fillLevel: 68, lastUpdated: '6 mins ago' },
      { id: '26', lat: 19.291, lng: 72.858, fillLevel: 35, lastUpdated: '10 mins ago' },
      { id: '27', lat: 19.279, lng: 72.864, fillLevel: 84, lastUpdated: '5 mins ago' },
      { id: '28', lat: 19.288, lng: 72.847, fillLevel: 20, lastUpdated: 'Just now' },
      { id: '29', lat: 19.294, lng: 72.852, fillLevel: 71, lastUpdated: '3 mins ago' },
      { id: '30', lat: 19.282, lng: 72.860, fillLevel: 50, lastUpdated: '7 mins ago' },
      { id: '31', lat: 19.286, lng: 72.854, fillLevel: 14, lastUpdated: '15 mins ago' },
      { id: '32', lat: 19.275, lng: 72.862, fillLevel: 95, lastUpdated: '2 mins ago' },
      { id: '33', lat: 19.280, lng: 72.844, fillLevel: 38, lastUpdated: '12 mins ago' },
      { id: '34', lat: 19.292, lng: 72.867, fillLevel: 62, lastUpdated: '4 mins ago' },
      { id: '35', lat: 19.273, lng: 72.856, fillLevel: 9, lastUpdated: '18 mins ago' },
      { id: '36', lat: 19.289, lng: 72.860, fillLevel: 86, lastUpdated: '1 min ago' },
      { id: '37', lat: 19.281, lng: 72.848, fillLevel: 27, lastUpdated: '11 mins ago' },
      { id: '38', lat: 19.296, lng: 72.846, fillLevel: 79, lastUpdated: '5 mins ago' },
      { id: '39', lat: 19.277, lng: 72.871, fillLevel: 53, lastUpdated: '9 mins ago' },
      { id: '40', lat: 19.284, lng: 72.866, fillLevel: 12, lastUpdated: '22 mins ago' },
    ]);

    setTrucks([
      { id: 't1', lat: 19.285, lng: 72.856, driverName: 'Pradeep Kumar' },
      { id: 't2', lat: 19.290, lng: 72.852, driverName: 'Ajay Solanki' },
      { id: 't3', lat: 19.275, lng: 72.860, driverName: 'Rajesh Mishra' },
      { id: 't4', lat: 19.282, lng: 72.845, driverName: 'Vikram Singh' },
      { id: 't5', lat: 19.295, lng: 72.862, driverName: 'Sanjay Patil' },
      { id: 't6', lat: 19.288, lng: 72.868, driverName: 'Amit Shah' },
    ]);

    const interval = setInterval(() => {
      setTrucks((prev) => 
        prev.map(t => ({
          ...t,
          lat: t.lat + (Math.random() - 0.5) * 0.0005,
          lng: t.lng + (Math.random() - 0.5) * 0.0005,
        }))
      );
    }, 4000);

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

        {bins.map((bin) => (
          <Marker 
            key={`bin-${bin.id}`} 
            position={[bin.lat, bin.lng]} 
            icon={createBinIcon(bin.fillLevel)}
          >
            <Popup className="rounded-xl overflow-hidden shadow-2xl border-none">
              <div className="p-2 min-w-[150px]">
                <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`} />
                   Smart Bin #{bin.id}
                </p>
                <div className="w-full bg-gray-100 h-2.5 rounded-full mb-2 overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${bin.fillLevel}%` }}
                      className={`h-full rounded-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                   />
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                   <span>{bin.fillLevel}% CAPACITY</span>
                   <span>{bin.lastUpdated}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {trucks.map((truck) => (
          <Marker 
            key={`truck-${truck.id}`} 
            position={[truck.lat, truck.lng]} 
            icon={createTruckIcon(truck.id)}
            eventHandlers={{
               click: () => setSelectedTruck(truck),
               mouseover: (e) => e.target.openPopup(),
               mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup closeButton={false} className="custom-tooltip shadow-lg border-none">
               <div className="px-2 py-1">
                  <p className="font-bold text-xs">{truck.driverName}</p>
                  <p className="text-[9px] opacity-60 uppercase font-mono">Route Tracking ACTIVE</p>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Driver Detail Modal Overlay */}
      <AnimatePresence>
        {selectedTruck && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 left-4 z-[1000] w-72 card bg-white/95 backdrop-blur shadow-2xl p-0 overflow-hidden border-none"
          >
            <div className="bg-primary p-4 text-white flex justify-between items-start">
               <div>
                  <h4 className="title-sm">{selectedTruck.driverName}</h4>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Driver ID: {selectedTruck.id.toUpperCase()}</p>
               </div>
               <button 
                  onClick={() => setSelectedTruck(null)}
                  className="bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition-colors border-none"
               >
                  <X size={16} />
               </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
               <div className="flex justify-between items-center bg-surface-low p-3 rounded-xl">
                  <div>
                    <p className="text-[10px] opacity-50 uppercase font-bold">Current Speed</p>
                    <p className="text-xl font-bold">22 <span className="text-xs">km/h</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-50 uppercase font-bold">Est. Delay</p>
                    <p className="text-xl font-bold text-error">+4 <span className="text-xs">min</span></p>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-xs">
                     <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><Truck size={16} /></div>
                     <div><p className="font-bold">Truck GJ-12-X-9981</p><p className="opacity-60 text-[10px]">Electric Compactor V2</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><MapPin size={16} /></div>
                     <div><p className="font-bold">Last Stop: Shanti Nagar</p><p className="opacity-60 text-[10px]">Successfully Cleared</p></div>
                  </div>
               </div>
               <button className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all border-none">
                  Open Direct Comms
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
        <div className="glass px-3 py-2 rounded-lg border border-white/20 shadow-md flex items-center gap-2 text-xs font-semibold backdrop-blur-md bg-white/60 dark:bg-black/40">
           <div className="w-2.5 h-2.5 rounded-full bg-brand-danger animate-pulse" />
           {bins.filter(b => b.fillLevel > 80).length} Critical Nodes
        </div>
        <div className="glass px-3 py-2 rounded-lg border border-white/20 shadow-md flex items-center gap-2 text-xs font-semibold backdrop-blur-md bg-white/60 dark:bg-black/40">
           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
           {trucks.length} Units Active
        </div>
      </div>
    </div>
  );
}
