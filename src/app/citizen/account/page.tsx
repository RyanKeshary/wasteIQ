'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Globe, Save, Lock, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CitizenAccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 98765 43210',
    ward: 'W-14, Mira Road East',
    language: 'English',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Saving profile changes...', { id: 'save-profile' });
    
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    
    setIsLoading(false);
    setIsEditing(false);
    toast.success('Profile updated successfully!', { id: 'save-profile' });
  };

  const handlePasswordReset = () => {
    toast.success('Password reset link sent to your email.');
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="mb-8">
        <h1 className="headline-lg mb-2">Account Settings</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Manage your personal information, ward details, and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="card p-6 md:p-8 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                  color: 'white'
                }}
              >
                {profile.name[0]}
              </div>
              <div>
                <h2 className="title-lg font-bold">{profile.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="chip chip-success text-[10px]">VERIFIED RESIDENT</span>
                </div>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="btn-ghost flex items-center gap-2 text-sm"
              style={{ color: 'var(--primary)' }}
            >
              {isEditing ? 'Cancel' : <><Edit2 size={16} /> Edit Profile</>}
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-[10px] font-bold uppercase mb-2 flex items-center gap-1.5" style={{ color: 'var(--outline)' }}>
                  <User size={12} /> Full Name
                </label>
                <input 
                  type="text" 
                  className="input-field disabled:opacity-70"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase mb-2 flex items-center gap-1.5" style={{ color: 'var(--outline)' }}>
                  <Mail size={12} /> Email Address
                </label>
                <input 
                  type="email" 
                  className="input-field disabled:opacity-70"
                  value={profile.email}
                  disabled
                  title="Email cannot be changed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase mb-2 flex items-center gap-1.5" style={{ color: 'var(--outline)' }}>
                  <User size={12} /> Phone Number
                </label>
                <input 
                  type="tel" 
                  className="input-field disabled:opacity-70"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase mb-2 flex items-center gap-1.5" style={{ color: 'var(--outline)' }}>
                  <MapPin size={12} /> Registered Ward
                </label>
                {isEditing ? (
                  <select 
                    className="input-field bg-white dark:bg-black"
                    value={profile.ward}
                    onChange={(e) => setProfile({ ...profile, ward: e.target.value })}
                    required
                  >
                    <option value="W-14, Mira Road East">W-14, Mira Road East</option>
                    <option value="W-15, Bhayandar West">W-15, Bhayandar West</option>
                    <option value="W-16, Kashimira">W-16, Kashimira</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    className="input-field disabled:opacity-70"
                    value={profile.ward}
                    disabled
                  />
                )}
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase mb-2 flex items-center gap-1.5" style={{ color: 'var(--outline)' }}>
                  <Globe size={12} /> Language
                </label>
                {isEditing ? (
                  <select 
                    className="input-field bg-white dark:bg-black"
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    className="input-field disabled:opacity-70"
                    value={profile.language}
                    disabled
                  />
                )}
              </div>
            </div>

            {isEditing && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--outline-variant)' }}>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={isLoading}>
                  {isLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                </button>
              </motion.div>
            )}
          </form>
        </div>

        {/* Security Section */}
        <div className="card p-6">
          <h3 className="title-md font-bold mb-4 flex items-center gap-2"><Lock size={18} /> Security & Authentication</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-xl" style={{ border: '1px solid var(--outline-variant)' }}>
            <div>
              <p className="font-semibold text-sm">Password</p>
              <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)' }}>It is highly recommended to change your password every 6 months.</p>
            </div>
            <button onClick={handlePasswordReset} className="btn-ghost flex items-center gap-2 whitespace-nowrap border" style={{ borderColor: 'var(--outline-variant)' }}>
              Reset Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6" style={{ border: '1px solid rgba(186,26,26,0.3)', background: 'rgba(186,26,26,0.03)' }}>
          <h3 className="title-md font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--error)' }}><Trash2 size={18} /> Danger Zone</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <p className="font-semibold text-sm">Delete Account</p>
              <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)' }}>Permanently remove your data from the WasteIQ platform. This is irreversible.</p>
            </div>
            <button 
              onClick={() => toast.error('Account deletion requested. Support will contact you.')}
              className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
              style={{ background: 'var(--error)', color: 'white' }}
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
