/* eslint-disable @typescript-eslint/no-namespace */
/**
 * WasteIQ — TypeScript Type Definitions
 * Centralized types for the entire platform.
 * Mirrors the Prisma schema, adds client-specific types.
 */

// ── Enums ────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DRIVER' | 'CITIZEN';
export type BinStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OVERFLOW' | 'OFFLINE' | 'MAINTENANCE';
export type WasteType = 'MIXED' | 'WET' | 'DRY' | 'HAZARDOUS' | 'RECYCLABLE';
export type ScanAction = 'PICKUP_START' | 'PICKUP_COMPLETE' | 'INSPECTION' | 'MAINTENANCE_REPORT';
export type ZoneType = 'RESIDENTIAL' | 'COMMERCIAL' | 'HOSPITAL' | 'MARKET' | 'COASTAL' | 'SCHOOL' | 'INDUSTRIAL';
export type RouteStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EMERGENCY';
export type StopStatus = 'PENDING' | 'SKIPPED' | 'COMPLETED';
export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
export type EmergencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertType = 'OVERFLOW' | 'CRITICAL_FILL' | 'SENSOR_OFFLINE' | 'ROUTE_DELAY' | 'EMERGENCY' | 'EMERGENCY_SOS' | 'WEATHER';

// ── Models ───────────────────────────────────────────────────

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: UserRole;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  qrCode: string;
  latitude: number;
  longitude: number;
  address: string;
  zoneId: string;
  zone?: Zone;
  capacity: number;
  currentFill: number;
  lastCollectedAt: string | null;
  sensorHealth: boolean;
  priorityScore: number;
  status: BinStatus;
  type: WasteType;
  createdAt: string;
  updatedAt: string;
}

export interface BinTelemetry {
  id: string;
  binId: string;
  fillLevel: number;
  weight: number | null;
  temperature: number | null;
  humidity: number | null;
  batteryLevel: number | null;
  timestamp: string;
}

export interface ScanLog {
  id: string;
  binId: string;
  driverId: string;
  action: ScanAction;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  bin?: Bin;
  driver?: Driver;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  locationWeight: number;
  geoJson: Record<string, unknown> | null;
  createdAt: string;
  bins?: Bin[];
}

export interface Driver {
  id: string;
  userId: string;
  employeeId: string;
  vehicleNumber: string;
  vehicleCapacity: number;
  isActive: boolean;
  currentLat: number | null;
  currentLng: number | null;
  lastLocationAt: string | null;
  user?: User;
}

export interface DriverPerformance {
  id: string;
  driverId: string;
  date: string;
  binsCollected: number;
  routeAdherence: number | null;
  avgTimePerBin: number | null;
  idleTime: number | null;
  totalDistance: number | null;
}

export interface Route {
  id: string;
  driverId: string;
  zoneId: string | null;
  date: string;
  status: RouteStatus;
  totalDistance: number | null;
  estimatedTime: number | null;
  actualTime: number | null;
  startedAt: string | null;
  completedAt: string | null;
  isEmergency: boolean;
  driver?: Driver;
  zone?: Zone;
  stops?: RouteStop[];
}

export interface RouteStop {
  id: string;
  routeId: string;
  binId: string;
  sequence: number;
  status: StopStatus;
  arrivedAt: string | null;
  completedAt: string | null;
  bin?: Bin;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ComplaintStatus;
  priority: number;
  citizenId: string | null;
  binId: string | null;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  citizen?: Citizen;
  bin?: Bin;

  // Emergency SOS Extension
  isEmergency: boolean;
  emergencyLevel: EmergencyLevel;
  verifiedEmergency: boolean;
  emergencyScore: number;
  emergencyTriggeredAt: string | null;
}

export interface Citizen {
  id: string;
  userId: string;
  ward: string | null;
  points: number;
  user?: User;
}

export interface AreaRating {
  id: string;
  citizenId: string;
  zone: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  binId: string | null;
  zoneId: string | null;
  severity: number;
  isResolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

// ── API Response Types ───────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// ── Analytics Types ──────────────────────────────────────────

export interface DashboardOverview {
  totalBins: number;
  overflowBins: number;
  criticalBins: number;
  avgFillLevel: number;
  totalDrivers: number;
  activeDrivers: number;
  complaintsToday: number;
  collectionRate: number;
}

export interface KpiData {
  overflowIncidents: number;
  avgCollectionTime: number;
  segregationCompliance: number;
  citizenSatisfaction: number;
  fuelSaved: number;
  co2Diverted: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export interface ZoneRating {
  zoneId: string;
  zoneName: string;
  avgRating: number;
  totalRatings: number;
  breakdown: Record<number, number>;
}

// ── AI Types ─────────────────────────────────────────────────

export interface AiInsight {
  title: string;
  insight: string;
  action: string;
  severity: 'high' | 'medium' | 'low';
}

// ── Real-time Event Types ────────────────────────────────────

export interface BinTelemetryEvent {
  binId: string;
  fillLevel: number;
  status: BinStatus;
  priorityScore: number;
  timestamp: string;
}

export interface AlertEvent {
  type: AlertType;
  binId: string;
  message: string;
  severity: number;
}

export interface DriverLocationEvent {
  driverId: string;
  lat: number;
  lng: number;
  timestamp: string;
}

export interface RouteUpdateEvent {
  routeId: string;
  status: RouteStatus;
  stops: RouteStop[];
}

export interface ComplaintUpdateEvent {
  complaintId: string;
  status: ComplaintStatus;
  assignedTo: string | null;
}
