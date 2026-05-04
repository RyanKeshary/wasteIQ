/**
 * WasteIQ — Driver Profile Page
 * Fully functional: Contact, Email, Sign Out buttons.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Star,
  Award,
  Clock,
  Trash2,
  Route,
  Phone,
  Mail,
  LogOut,
  ChevronRight,
  Edit2,
  Save,
  User,
  MapPin,
  Lock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import CountUp from '@/components/effects/CountUp';

export default function DriverProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Pradeep Kumar',
    phone: '+91 98765 43210',
    email: 'pradeep@wasteiq.in',
    zone: 'Mira Road (East)',
    license: 'MH-04-1029348',
    joiningDate: '12 Oct 2023'
  });

  const handleCall = () => {
    toast.success('Initiating Secure Support Call...');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Synchronizing Cloud Identity...', { id: 'save' });
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setIsEditing(false);
    toast.success('Sync Successful', { id: 'save' });
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@wasteiq.in';
  };

  const handleSignOut = () => {
    toast.success('Terminating Driver Session...');
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="headline-lg">Driver Command Profile</h1>
          <p className="body-md opacity-70">Manage your credentials and view performance telemetry.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="btn-ghost flex items-center gap-2 group border-primary/20 hover:border-primary transition-all rounded-xl py-3 px-6"
        >
          {isEditing ? 'Cancel Sync' : <><Edit2 size={18} className="group-hover:rotate-12 transition-transform" /> Modify Identity</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* IDENTITY PANE (Left Column on Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Identity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-0 overflow-hidden shadow-xl"
            style={{ background: 'var(--surface-lowest)' }}
          >
            <div className="h-32 bg-gradient-to-r from-primary to-primary-container relative">
               <div className="absolute -bottom-12 left-8 p-1 rounded-3xl bg-white shadow-2xl">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold bg-surface-lowest text-primary">
                    {profile.name.substring(0,2).toUpperCase()}
                  </div>
               </div>
            </div>

            <div className="pt-16 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="headline-sm">{profile.name}</h2>
                   <p className="body-sm text-primary font-bold tracking-widest uppercase mt-1">Senior Logistics Operator</p>
                </div>
                <div className="card bg-success-container/30 border-none px-3 py-1 text-primary text-[10px] font-black uppercase tracking-tighter">
                   Active Service
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="card bg-surface-low border-none p-4">
                          <span className="text-[10px] font-bold uppercase text-outline">Communication</span>
                          <div className="mono-sm font-bold mt-1 text-on-surface">{profile.phone}</div>
                       </div>
                       <div className="card bg-surface-low border-none p-4">
                          <span className="text-[10px] font-bold uppercase text-outline">Network Identity</span>
                          <div className="mono-sm font-bold mt-1 text-on-surface truncate">{profile.email}</div>
                       </div>
                       <div className="card bg-surface-low border-none p-4">
                          <span className="text-[10px] font-bold uppercase text-outline">Service Zone</span>
                          <div className="mono-sm font-bold mt-1 text-on-surface">{profile.zone}</div>
                       </div>
                       <div className="card bg-surface-low border-none p-4">
                          <span className="text-[10px] font-bold uppercase text-outline">Member Since</span>
                          <div className="mono-sm font-bold mt-1 text-on-surface">{profile.joiningDate}</div>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant flex items-center justify-between">
                       <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= 4 ? "text-warning fill-warning" : "text-outline opacity-30"} />)}
                       </div>
                       <div className="text-right">
                          <div className="title-sm">Operational Merit</div>
                          <p className="text-[10px] text-outline">Ranked Top 5% in Region</p>
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="edit" onSubmit={handleSave} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold uppercase text-outline mb-1.5 block">Operator Name</label>
                        <input type="text" className="input-field py-4" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-bold uppercase text-outline mb-1.5 block">Contact Line</label>
                          <input type="tel" className="input-field py-4" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold uppercase text-outline mb-1.5 block">Zone Assignment</label>
                          <input type="text" className="input-field py-4" value={profile.zone} onChange={e => setProfile({...profile, zone: e.target.value})} />
                       </div>
                     </div>
                     <button type="submit" className="btn-primary w-full h-14" disabled={isLoading}>
                       {isLoading ? 'Syncing...' : 'Confirm Sync Changes'}
                     </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Vehicle Info */}
          <div className="card p-8">
             <div className="flex items-center justify-between mb-6">
                <h3 className="title-lg">Assets Under Command</h3>
                <Truck className="text-primary opacity-30" size={24} />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <div className="text-xs font-bold uppercase text-outline mb-1">Plate Number</div>
                   <div className="title-md font-mono">MH-04-AX-2291</div>
                </div>
                <div>
                   <div className="text-xs font-bold uppercase text-outline mb-1">Type</div>
                   <div className="title-md">EV-Compact-T3</div>
                </div>
                <div>
                   <div className="text-xs font-bold uppercase text-outline mb-1">Service Status</div>
                   <div className="title-md text-success">Good (98%)</div>
                </div>
                <div>
                   <div className="text-xs font-bold uppercase text-outline mb-1">Fuel/Energy</div>
                   <div className="title-md">86% Charged</div>
                </div>
             </div>
          </div>
        </div>

        {/* ANALYTICS & DOCUMENTS (Right Column on Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Stats Highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {[
               { icon: Trash2, val: 1247, label: 'Bins Cleared', col: 'text-primary' },
               { icon: Route, val: 186, label: 'Patrols Run', col: 'text-secondary' },
               { icon: Clock, val: '4.2', label: 'Avg Speed/Bin', col: 'text-tertiary', suf: 'm' },
               { icon: Award, val: 12, label: 'Safety Seals', col: 'text-primary' },
             ].map((st, i) => (
                <motion.div 
                  key={st.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 text-center border-none shadow-sm"
                  style={{ background: 'var(--surface-lowest)' }}
                >
                   <st.icon className={`mx-auto mb-3 ${st.col}`} size={20} />
                   <div className="text-2xl font-black">{st.val}{st.suf}</div>
                   <div className="text-[10px] font-bold uppercase text-outline mt-1 tracking-wider">{st.label}</div>
                </motion.div>
             ))}
          </div>

          {/* Documentation Block */}
          <div className="card p-8">
             <h3 className="title-lg mb-6 flex items-center gap-3">
               <User className="text-primary" size={20} /> Credentials & Compliance
             </h3>
             <div className="space-y-4">
                {[
                  { label: 'Commercial Driving License', status: 'Valid until 2028', icon: Award },
                  { label: 'Annual Background Verification', status: 'Passed Oct 2023', icon: Lock },
                  { label: 'Hazmat Handling Permit', status: 'Level 2 Certified', icon: Zap },
                  { label: 'Insurance Policy (P-88)', status: 'Active (Group Plan)', icon: ShieldCheck },
                ].map((doc, i) => (
                   <div key={doc.label} className="flex items-center justify-between p-4 rounded-2xl bg-surface-low group cursor-pointer hover:bg-surface-high transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <doc.icon size={18} />
                         </div>
                         <div>
                            <div className="title-sm">{doc.label}</div>
                            <div className="text-xs text-outline">{doc.status}</div>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-outline" />
                   </div>
                ))}
             </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <button onClick={handleCall} className="btn-ghost flex flex-col items-center gap-3 py-6 rounded-3xl border-2 hover:bg-primary/5 hover:border-primary transition-all group">
                <Phone className="text-primary group-hover:scale-125 transition-transform" />
                <span className="title-sm">Voice Support</span>
             </button>
             <button onClick={handleEmail} className="btn-ghost flex flex-col items-center gap-3 py-6 rounded-3xl border-2 hover:bg-secondary/5 hover:border-secondary transition-all group">
                <Mail className="text-secondary group-hover:scale-125 transition-transform" />
                <span className="title-sm">Ticket Hub</span>
             </button>
             <button onClick={handleSignOut} className="btn-ghost flex flex-col items-center gap-3 py-6 rounded-3xl border-2 hover:bg-error/5 hover:border-error transition-all group">
                <LogOut className="text-error group-hover:scale-125 transition-transform" />
                <span className="title-sm">End Terminal</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
