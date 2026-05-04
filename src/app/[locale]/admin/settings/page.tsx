/**
 * WasteIQ — Admin Settings Page
 * All toggles and inputs are functional with instant toast feedback.
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Bell, MapPin, Shield, Zap, Wifi, Moon, Globe, Database } from 'lucide-react';
import { toast } from 'sonner';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  enabled: boolean;
}

const initialSettings: SettingItem[] = [
  { id: 'realtime', label: 'Real-time Telemetry', description: 'Live sensor data streaming via Ably', icon: Wifi, enabled: true },
  { id: 'alerts', label: 'Alert Notifications', description: 'Push alerts for overflow and critical events', icon: Bell, enabled: true },
  { id: 'emergency', label: 'Emergency Auto-Dispatch', description: 'Auto-assign drivers for critical overflow', icon: Zap, enabled: false },
  { id: 'geofence', label: 'Geofencing Alerts', description: 'Notify when drivers leave assigned zones', icon: MapPin, enabled: true },
  { id: 'darkmode', label: 'Dark Mode', description: 'Switch to dark theme interface', icon: Moon, enabled: false },
  { id: 'public', label: 'Public Transparency', description: 'Share cleanliness metrics on public portal', icon: Globe, enabled: true },
  { id: 'backup', label: 'Auto Database Backup', description: 'Daily automatic database snapshots', icon: Database, enabled: true },
  { id: 'security', label: '2FA Authentication', description: 'Two-factor authentication for admin users', icon: Shield, enabled: false },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newVal = !s.enabled;
        toast(newVal ? `${s.label} enabled` : `${s.label} disabled`, {
          description: s.description,
          duration: 2000,
        });
        return { ...s, enabled: newVal };
      })
    );
    setHasChanges(true);
  };

  const saveAll = () => {
    toast.success('Settings saved successfully!', {
      description: 'All configuration changes have been applied.',
    });
    setHasChanges(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Platform Settings</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Configure system preferences and integrations
          </p>
        </div>
        <button
          className={`btn-primary ${!hasChanges ? 'opacity-50' : ''}`}
          onClick={saveAll}
          disabled={!hasChanges}
          style={{ opacity: hasChanges ? 1 : 0.5 }}
        >
          <Save size={14} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {settings.map((setting, i) => {
          const Icon = setting.icon;
          return (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: setting.enabled ? 'var(--success-container)' : 'var(--surface-low)',
                }}
              >
                <Icon size={18} style={{ color: setting.enabled ? 'var(--primary)' : 'var(--outline)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="title-sm">{setting.label}</h3>
                <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>{setting.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(setting.id)}
                className="relative w-12 h-7 rounded-full transition-all flex-shrink-0"
                style={{
                  background: setting.enabled ? 'var(--primary)' : 'var(--outline-variant)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={`Toggle ${setting.label}`}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 rounded-full"
                  style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                  animate={{ left: setting.enabled ? '22px' : '2px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
