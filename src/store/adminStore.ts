/**
 * WasteIQ — Admin Store (Zustand)
 * Global state for admin panel: bins, alerts, drivers, analytics.
 */
import { create } from 'zustand';
import type { Bin, Alert, Driver, DashboardOverview, AiInsight, Route } from '@/types';

interface AdminState {
  // State
  bins: Bin[];
  alerts: Alert[];
  drivers: Driver[];
  routes: Route[];
  overview: DashboardOverview | null;
  aiInsights: AiInsight[];
  isLoading: boolean;
  emergencyMode: boolean;
  sidebarCollapsed: boolean;

  // Actions
  setBins: (bins: Bin[]) => void;
  updateBin: (binId: string, updates: Partial<Bin>) => void;
  setAlerts: (alerts: Alert[]) => void;
  prependAlert: (alert: Alert) => void;
  resolveAlert: (alertId: string) => void;
  setDrivers: (drivers: Driver[]) => void;
  updateDriverLocation: (driverId: string, lat: number, lng: number) => void;
  setRoutes: (routes: Route[]) => void;
  setOverview: (overview: DashboardOverview) => void;
  setAiInsights: (insights: AiInsight[]) => void;
  setLoading: (loading: boolean) => void;
  toggleEmergencyMode: () => void;
  toggleSidebar: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  bins: [],
  alerts: [],
  drivers: [],
  routes: [],
  overview: null,
  aiInsights: [],
  isLoading: true,
  emergencyMode: false,
  sidebarCollapsed: false,

  setBins: (bins) => set({ bins }),
  updateBin: (binId, updates) =>
    set((state) => ({
      bins: state.bins.map((b) => (b.id === binId ? { ...b, ...updates } : b)),
    })),
  setAlerts: (alerts) => set({ alerts }),
  prependAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),
  resolveAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, isResolved: true } : a
      ),
    })),
  setDrivers: (drivers) => set({ drivers }),
  updateDriverLocation: (driverId, lat, lng) =>
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, currentLat: lat, currentLng: lng } : d
      ),
    })),
  setRoutes: (routes) => set({ routes }),
  setOverview: (overview) => set({ overview }),
  setAiInsights: (insights) => set({ aiInsights: insights }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleEmergencyMode: () =>
    set((state) => ({ emergencyMode: !state.emergencyMode })),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
