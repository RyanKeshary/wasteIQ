# ♻️ WasteIQ

> **"Not just a website — an unforgettable experience."**

**WasteIQ** is a full-stack, cloud-native, AI-assisted smart waste management platform purpose-built for **Mira-Bhayandar Municipal Corporation** — and architected to scale to any Indian city. It replaces reactive, schedule-based garbage collection with a predictive, data-driven, real-time intelligent system delivered through a modern, animated, production-grade web application.

🌐 **Live Demo:** [wasteiq-phi.vercel.app](https://wasteiq-phi.vercel.app)
📂 **Repository:** [github.com/RyanKeshary/wasteIQ](https://github.com/RyanKeshary/wasteIQ)

---

## Table of Contents

1. [What Is WasteIQ?](#1-what-is-wasteiq)
2. [The Problem It Solves](#2-the-problem-it-solves)
3. [Platform Goals & Targets](#3-platform-goals--targets)
4. [The Four-Panel System](#4-the-four-panel-system)
5. [Tech Stack](#5-tech-stack)
6. [Architecture Overview](#6-architecture-overview)
7. [Database Design](#7-database-design)
8. [File & Folder Structure](#8-file--folder-structure)
9. [API Reference](#9-api-reference)
10. [Features — Small to Large](#10-features--small-to-large)
11. [Design System](#11-design-system)
12. [Animation System](#12-animation-system)
13. [Real-Time Features](#13-real-time-features)
14. [IoT & Sensor Integration](#14-iot--sensor-integration)
15. [AI & Prediction Engine](#15-ai--prediction-engine)
16. [Route Optimization (VRP)](#16-route-optimization-vrp)
17. [Smart Priority Engine](#17-smart-priority-engine)
18. [Authentication & Role-Based Access](#18-authentication--role-based-access)
19. [Map System](#19-map-system)
20. [Offline & PWA Support](#20-offline--pwa-support)
21. [Security](#21-security)
22. [Performance & Caching](#22-performance--caching)
23. [Error Handling & Monitoring](#23-error-handling--monitoring)
24. [Deployment](#24-deployment)
25. [Environment Variables](#25-environment-variables)
26. [Local Setup & Quick Start](#26-local-setup--quick-start)
27. [Database Seeding](#27-database-seeding)
28. [Roadmap & Future Scope](#28-roadmap--future-scope)
29. [Project Info](#29-project-info)

---

## 1. What Is WasteIQ?

WasteIQ is not just a dashboard. It is a **civic intelligence platform** — an end-to-end system that connects smart bin sensors, garbage collection drivers, city administrators, and everyday citizens into a single unified experience. Every piece of data flows in real time. Every screen is animated with intention. Every decision the system makes is backed by a priority algorithm or AI inference.

The platform was born out of a fundamental dissatisfaction with how Indian municipalities manage urban waste today: fixed schedules, zero citizen visibility, no driver accountability, and bins that overflow for days before anyone acts. WasteIQ is the answer to that — built as a real, production-grade system, not a prototype or a demo.

It serves **four distinct user types** through **four distinct panels**, each designed from the ground up for the device and context that user operates in. The Admin panel is data-dense and desktop-first. The Driver panel is mobile-first and offline-capable. The Citizen panel is gamified and friendly. The Public panel is cinematic and open.

---

## 2. The Problem It Solves

| Problem | Real-World Impact |
|---|---|
| Bins overflow before trucks arrive | Public health crisis, odor, vector disease |
| Fixed schedules waste fuel on empty bins | Operational loss in ₹, increased carbon footprint |
| Segregation compliance stuck at ~40% | Landfill pressure, recycling goals unmet |
| Citizens have zero transparency into collection | Low civic trust, no accountability |
| Drivers skip stops or ghost-report collections | Fake completion data, incomplete routes |
| Complaints vanish into bureaucratic voids | Repeated issues, civic frustration, no tracking |
| No predictive alerts before overflow happens | Reactive management instead of proactive prevention |
| No route intelligence — trucks follow fixed maps | Inefficient coverage, high fuel cost |
| No performance data on drivers | No incentive structure, no accountability |
| No zone-level analytics for planners | Resource allocation decisions made blindly |

WasteIQ addresses every single one of these problems with a specific feature or system component.

---

## 3. Platform Goals & Targets

| Goal | Mechanism |
|---|---|
| Reduce overflow incidents by ≥40% | Predictive bin monitoring + priority alerts |
| Improve segregation compliance by ≥15% | QR scan validation + gamified citizen rewards |
| Reduce route distance by ≥20% | Vehicle Routing Problem (VRP) algorithm |
| Resolve complaints ≥30% faster | Automated triaging, assignment, and escalation |
| Zero missed collections in critical zones | AI-prioritized smart routing |
| Full driver accountability | GPS tracking + QR scan verification at each stop |
| Citizen engagement and transparency | Public map, complaint tracking, rewards system |

---

## 4. The Four-Panel System

WasteIQ runs four completely independent, role-authenticated panels under one unified codebase.

### 🏛️ Admin Panel
For city officials, supervisors, and operations managers. Desktop-first bento-grid layout. Features include:
- Real-time system dashboard with animated KPI cards
- Live city map with colored bin markers that update on sensor data
- Priority queue showing which bins need collection most urgently
- Live alert feed (Ably WebSocket powered)
- Route management and VRP optimizer trigger
- Driver tracking and live GPS positions on map
- Complaint triage and assignment console
- Full KPI analytics with charts (fill trends, zone performance, compliance)
- Leaflet heatmap overlay for overflow density visualization
- AI Insights panel powered by Google Gemini
- Emergency Mode toggle for city-wide crisis response
- Zone management and area ratings
- System settings

### 🚛 Driver Panel
For waste collection truck operators. Mobile-first, high-contrast, large-tap targets. PWA-enabled for offline use. Features include:
- Today's assigned route with stop list and sequence
- Interactive navigation map (Leaflet)
- QR code scanner for bin confirmation at each stop
- Offline scan queuing (IndexedDB + Background Sync)
- Personal performance stats and daily metrics
- Collection history with timestamps
- Real-time route updates pushed via Ably
- Bottom navigation bar (mobile-optimized)

### 🏠 Citizen Panel
For registered residents. Clean, friendly, gamified design. Features include:
- Home screen with ward-level collection schedule
- Issue reporting form with image upload and optional GPS location
- Complaint tracker with real-time status updates
- Nearby bin map (shows fill levels of bins in area)
- Area ratings — rate hygiene of your zone
- Rewards dashboard — earn points for reporting issues, rating areas, and compliance
- Badges for civic engagement milestones
- Google OAuth sign-in

### 🌍 Public Panel (No Login Required)
For visitors, guests, journalists, and unregistered citizens. Features include:
- Cinematic hero section with animated particle background
- Live city statistics (animated counters: bins monitored, active drivers, collections today)
- Interactive public Leaflet map showing all bins and their statuses
- Guest complaint submission form (no account needed)
- Feature showcase explaining the platform
- Cinematic About page with scrolling timeline

---

## 5. Tech Stack

Every single tool in this stack is **free at the scale of this project** and deploys to Vercel without any paid tier requirement.

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x (App Router) | Full-stack React framework, SSR/SSG, API routes |
| **React** | 19 | Component model |
| **TypeScript** | 5.x | Full type safety throughout |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | 11 | Animations, spring physics, layout transitions |
| **GSAP** | 3.x | Advanced timeline animations |
| **Leaflet + React-Leaflet** | 1.9.x / 5.x | Interactive maps — 100% free, no API key needed |
| **Recharts** | 3.x | Charts and analytics visualizations |
| **React Hook Form** | 7.x | Form state management |
| **Zod** | 4.x | Schema validation (shared client + server) |
| **Zustand** | 4.x | Lightweight global state management |
| **NextAuth.js** | 5.x (beta) | Authentication (Google OAuth + credentials) |
| **Sonner** | 2.x | Toast notification system |
| **Lucide React** | Latest | Icon library |
| **Three.js + @react-three/fiber** | 0.183 / 9.x | 3D elements |
| **@react-three/drei** | 10.x | Three.js helper components |
| **react-countup** | 6.x | Animated number counters |
| **react-intersection-observer** | 10.x | Scroll-triggered animations |
| **lottie-react** | 2.x | Lottie JSON animations (empty states, success) |
| **clsx** | 2.x | Conditional className utility |

### Backend (Serverless via Next.js API Routes)

| Technology | Purpose |
|---|---|
| **Next.js API Routes** | Serverless REST backend on Vercel Edge |
| **Prisma ORM** | Type-safe database access with auto-generated client |
| **Neon PostgreSQL** | Serverless Postgres — free tier: 0.5 GB |
| **Upstash Redis** | Caching, rate limiting, pub/sub — free: 10K cmds/day |
| **Ably** | WebSocket real-time events — free: 6M messages/month |
| **Cloudinary** | Image uploads (complaint photos) — free: 25 GB/month |
| **Resend** | Transactional email (OTP, alerts) — free: 3K/month |
| **bcryptjs** | Password hashing with salt rounds 12 |
| **@upstash/ratelimit** | Rate limiting middleware |

### AI & Optimization

| Technology | Purpose |
|---|---|
| **Google Gemini API** | AI operational insights — free: 1500 req/day |
| **scikit-learn (Python)** | Fill level prediction model |
| **OR-Tools (Python)** | Vehicle Routing Problem solver |
| **Python Serverless Functions** | VRP and ML inference endpoints |

### Maps

| Technology | Detail |
|---|---|
| **Leaflet** | Open-source, no API key, 100% free forever |
| **OpenStreetMap** | Free tile provider with attribution |
| **CartoDB Dark Matter** | Alternative dark tile option |
| **leaflet.heat** | Heatmap overlay plugin |
| **leaflet.markercluster** | Bin clustering for performance |
| **leaflet-routing-machine** | Route polyline display |
| **leaflet-draw** | Admin zone boundary drawing |

### DevOps & Tooling

| Tool | Purpose |
|---|---|
| **Vercel** | Deployment, CDN, Edge Network, Cron Jobs |
| **GitHub Actions** | CI/CD pipeline |
| **Sentry** | Error monitoring — free: 5K errors/month |
| **Vercel Analytics** | Performance and web vitals monitoring |

---

## 6. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  ┌──────────┐  │
│  │ Admin Panel │  │Driver Panel │  │  Citizen  │  │  Public  │  │
│  │ (Bento UI) │  │(Mobile PWA) │  │   Panel   │  │ Landing  │  │
│  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  └────┬─────┘  │
└─────────┼───────────────┼───────────────┼──────────────┼─────────┘
          │               │               │              │
┌─────────▼───────────────▼───────────────▼──────────────▼─────────┐
│              NEXT.JS APP ROUTER (Vercel Serverless Edge)           │
│   /api/bins  /api/routes  /api/complaints  /api/auth               │
│   /api/drivers  /api/citizens  /api/alerts  /api/analytics         │
│   /api/ai  /api/cron  /api/priority                                │
└─────────────────────────┬────────────────────────────────────────┘
                           │
          ┌────────────────┼──────────────────┐
          │                │                  │
┌─────────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Neon PostgreSQL │  │Upstash Redis│  │ Ably WebSockets │
│  (Primary DB)   │  │(Cache/Rate) │  │  (Real-time)    │
└─────────────────┘  └─────────────┘  └─────────────────┘
          │
┌─────────▼────────────────────────────────────────────┐
│               EXTERNAL FREE SERVICES                  │
│  Cloudinary (Images)   OpenStreetMap (Maps)           │
│  Resend (Email)        Google Gemini API (AI)         │
│  OR-Tools/Python (Route Optimization)                 │
└──────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────┐
│                  IoT DATA INGESTION                    │
│  Smart Bin Sensors → /api/bins/telemetry              │
│      → Priority Engine → DB update → Ably push        │
│  QR Scan Events → /api/bins/scan → Route update       │
└──────────────────────────────────────────────────────┘
```

### Data Flow

1. **IoT smart bins** push sensor readings (fill %, weight, temperature, battery) to `/api/bins/telemetry` via HTTP with API key authentication.
2. **Priority Engine** recalculates each bin's urgency score on every telemetry event, plus every 5 minutes via Vercel Cron.
3. **Route Optimizer** runs nightly (or on-demand by admin) via a Python serverless function using OR-Tools VRP solver.
4. **Admin Dashboard** receives live updates via Ably WebSocket channels — no page refresh needed.
5. **Driver App** receives route assignments and confirmation prompts pushed via Ably.
6. **Citizens** submit complaints and track resolution in real time.
7. **Public users** explore the live map and submit guest complaints with zero login friction.

---

## 7. Database Design

The database is hosted on **Neon PostgreSQL** (serverless, free tier). Schema is managed with **Prisma ORM**.

### Models & Entities

#### User & Authentication
- `User` — Central identity record. Supports email/phone/Google OAuth. Roles: `SUPER_ADMIN`, `ADMIN`, `DRIVER`, `CITIZEN`.
- `Session` — Token-based session management.

#### Bin System
- `Bin` — Core entity. Fields: `qrCode`, `latitude`, `longitude`, `address`, `zoneId`, `capacity`, `currentFill`, `lastCollectedAt`, `sensorHealth`, `priorityScore`, `status`, `type`.
  - Statuses: `NORMAL`, `WARNING`, `CRITICAL`, `OVERFLOW`, `OFFLINE`, `MAINTENANCE`
  - Waste types: `MIXED`, `WET`, `DRY`, `HAZARDOUS`, `RECYCLABLE`
- `BinTelemetry` — Append-only time-series log per bin. Fields: `fillLevel`, `weight`, `temperature`, `humidity`, `batteryLevel`, `timestamp`. Indexed on `(binId, timestamp)` for fast range queries.
- `ScanLog` — Records every QR scan event. Scan actions: `PICKUP_START`, `PICKUP_COMPLETE`, `INSPECTION`, `MAINTENANCE_REPORT`.

#### Zone System
- `Zone` — Geographic grouping of bins. Types: `RESIDENTIAL`, `COMMERCIAL`, `HOSPITAL`, `MARKET`, `COASTAL`, `SCHOOL`, `INDUSTRIAL`. Stores `locationWeight` (higher for hospitals/markets) and optional `geoJson` polygon.

#### Driver System
- `Driver` — Linked to `User`. Fields: `employeeId`, `vehicleNumber`, `vehicleCapacity`, `isActive`, `currentLat`, `currentLng`, `lastLocationAt`.
- `DriverPerformance` — Daily performance record. Tracks: `binsCollected`, `routeAdherence`, `avgTimePerBin`, `idleTime`, `totalDistance`.

#### Route System
- `Route` — A collection run assigned to a driver. Statuses: `PENDING`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `EMERGENCY`. Tracks `totalDistance`, `estimatedTime`, `actualTime`, `isEmergency`.
- `RouteStop` — Individual bin stop in a route. Has `sequence` order and status: `PENDING`, `SKIPPED`, `COMPLETED`.

#### Complaint System
- `Complaint` — Supports both authenticated citizen complaints and guest submissions. Fields: `title`, `description`, `imageUrl`, `latitude`, `longitude`, `priority`, `assignedTo`, `resolvedAt`. Statuses: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `ESCALATED`.

#### Citizen System
- `Citizen` — Extended profile for registered residents. Tracks `ward`, `points` (rewards).
- `AreaRating` — Citizens rate zone cleanliness (1–5 stars with optional comment).

#### Alert System
- `Alert` — System-generated notifications. Types: `OVERFLOW`, `CRITICAL_FILL`, `SENSOR_OFFLINE`, `ROUTE_DELAY`, `EMERGENCY`, `WEATHER`. Has `severity` (1 = critical, 5 = informational) and `isResolved`.

---

## 8. File & Folder Structure

```
wasteiq/
├── prisma/
│   ├── schema.prisma               # Full database schema
│   ├── seed.ts                     # Realistic mock data seeder
│   └── migrations/                 # Auto-generated Prisma migrations
│
├── public/
│   ├── icons/                      # PWA icons, favicon.ico
│   ├── lottie/                     # Lottie JSON animations
│   │   ├── success.json
│   │   ├── empty-state.json
│   │   └── loading.json
│   └── images/
│       ├── og-image.png            # Open Graph social preview
│       └── about/                  # About page imagery
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (providers, fonts)
│   │   ├── page.tsx                # Public landing page
│   │   ├── globals.css             # Design tokens, keyframes
│   │   ├── about/page.tsx          # Cinematic about page
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Login form
│   │   │   ├── register/page.tsx   # Citizen registration (3-step)
│   │   │   └── verify/page.tsx     # OTP verification
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin sidebar layout
│   │   │   ├── page.tsx            # Bento dashboard
│   │   │   ├── bins/               # Bin monitoring + live map
│   │   │   ├── routes/             # Route optimizer
│   │   │   ├── drivers/            # Driver tracking
│   │   │   ├── complaints/         # Complaint triage
│   │   │   ├── analytics/          # Full KPI analytics
│   │   │   ├── heatmap/            # Leaflet heatmap view
│   │   │   ├── alerts/             # Live alert feed
│   │   │   ├── emergency/          # Emergency mode
│   │   │   └── settings/           # System configuration
│   │   │
│   │   ├── driver/
│   │   │   ├── layout.tsx          # Mobile-optimized layout
│   │   │   ├── page.tsx            # Today's route dashboard
│   │   │   ├── route/              # Active navigation
│   │   │   ├── scan/               # QR scanner
│   │   │   ├── history/            # Collection history
│   │   │   └── performance/        # Personal stats
│   │   │
│   │   ├── citizen/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Citizen home
│   │   │   ├── report/             # Report issue form
│   │   │   ├── track/              # Complaint tracker
│   │   │   ├── ratings/            # Area ratings
│   │   │   ├── rewards/            # Points & badges
│   │   │   └── map/                # Nearby bin map
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── bins/               # Bin CRUD, telemetry, QR scan
│   │       ├── routes/             # Route management + VRP trigger
│   │       ├── complaints/         # Complaint lifecycle
│   │       ├── drivers/            # Driver management + location
│   │       ├── alerts/             # Alert feed
│   │       ├── analytics/          # KPI, heatmap, overview
│   │       ├── priority/           # Priority recalculation
│   │       ├── citizens/           # Citizen profiles + rewards
│   │       ├── ai/                 # Gemini insights + fill prediction
│   │       └── cron/               # Vercel scheduled jobs
│   │
│   ├── components/
│   │   ├── ui/                     # Base design system components
│   │   │   ├── Button.tsx          # Animated, loading states
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx           # Status badges (soft tints)
│   │   │   ├── Modal.tsx           # Framer Motion modal
│   │   │   ├── StatCard.tsx        # Animated KPI card
│   │   │   ├── DataTable.tsx       # Sortable data table
│   │   │   ├── SkeletonCard.tsx    # Shimmer skeleton
│   │   │   ├── SkeletonTable.tsx
│   │   │   ├── SkeletonMap.tsx
│   │   │   ├── SkeletonStat.tsx
│   │   │   └── ProgressRing.tsx    # SVG circular progress ring
│   │   │
│   │   ├── maps/
│   │   │   ├── CityMap.tsx         # Main Leaflet map component
│   │   │   ├── BinMarker.tsx       # Custom SVG bin marker
│   │   │   ├── RouteLayer.tsx      # Route polylines
│   │   │   ├── HeatmapLayer.tsx    # Heatmap overlay
│   │   │   └── DriverTracker.tsx   # Live driver GPS marker
│   │   │
│   │   ├── charts/
│   │   │   ├── FillLevelChart.tsx  # Area chart with glow effect
│   │   │   ├── ComplianceChart.tsx # Radial bar
│   │   │   ├── CollectionTrendsChart.tsx
│   │   │   └── PerformanceRadar.tsx
│   │   │
│   │   ├── effects/
│   │   │   ├── ParticleField.tsx   # Canvas particle system (hero)
│   │   │   ├── GlowPulse.tsx       # Alert pulsing ring
│   │   │   ├── ScrollReveal.tsx    # IntersectionObserver wrapper
│   │   │   ├── MagneticButton.tsx  # Magnetic mouse hover
│   │   │   ├── CountUp.tsx         # Animated number counter
│   │   │   ├── GradientText.tsx    # Animated gradient text
│   │   │   └── NoiseBg.tsx         # SVG noise texture overlay
│   │   │
│   │   ├── admin/                  # Admin-specific components
│   │   ├── driver/                 # Driver-specific components
│   │   ├── citizen/                # Citizen-specific components
│   │   └── public/                 # Public landing components
│   │
│   ├── lib/
│   │   ├── prisma.ts               # Prisma singleton client
│   │   ├── redis.ts                # Upstash Redis client
│   │   ├── ably.ts                 # Ably REST + Realtime clients
│   │   ├── cloudinary.ts           # Image upload helper
│   │   ├── auth.ts                 # NextAuth config
│   │   ├── priority-engine.ts      # Priority score calculator
│   │   ├── vrp-client.ts           # Python VRP API client
│   │   ├── gemini.ts               # Google Gemini API wrapper
│   │   ├── leaflet-utils.ts        # Map helper functions
│   │   └── utils.ts                # General utilities
│   │
│   ├── hooks/
│   │   ├── useBins.ts
│   │   ├── useDriverLocation.ts
│   │   ├── useAlerts.ts
│   │   ├── useRoute.ts
│   │   ├── useAbly.ts              # Ably WebSocket channel hook
│   │   ├── useScrollReveal.ts      # Scroll animation hook
│   │   └── useCountUp.ts           # Counter animation hook
│   │
│   ├── stores/
│   │   ├── adminStore.ts           # Zustand store for admin state
│   │   ├── driverStore.ts
│   │   └── citizenStore.ts
│   │
│   ├── types/                      # Shared TypeScript types
│   │   ├── bin.ts
│   │   ├── route.ts
│   │   ├── driver.ts
│   │   ├── complaint.ts
│   │   ├── citizen.ts
│   │   └── analytics.ts
│   │
│   └── python/                     # Python serverless functions
│       ├── vrp_solver.py           # OR-Tools VRP implementation
│       ├── predict_fill.py         # scikit-learn prediction model
│       └── requirements.txt
│
├── .env.example
├── next.config.ts
├── prisma.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json                     # Cron job config
```

---

## 9. API Reference

All API routes are Next.js serverless functions deployed to Vercel Edge.

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/bins` | GET | Public | List all bins with status and fill level |
| `/api/bins/[id]` | GET | Public | Get single bin detail with telemetry history |
| `/api/bins/telemetry` | POST | IoT API Key | Submit sensor reading from smart bin hardware |
| `/api/bins/scan` | POST | Driver | QR scan confirmation at bin stop |
| `/api/routes` | GET | Driver / Admin | List routes |
| `/api/routes/[id]` | GET | Driver / Admin | Get single route with stops |
| `/api/routes/optimize` | POST | Admin | Trigger VRP route optimization |
| `/api/complaints` | GET | Admin | List all complaints |
| `/api/complaints` | POST | Public | Submit complaint (guest or authenticated) |
| `/api/complaints/[id]` | GET/PATCH | Admin / Citizen | Complaint detail / status update |
| `/api/complaints/[id]/assign` | POST | Admin | Assign complaint to driver/staff |
| `/api/drivers` | GET | Admin | List all drivers with GPS positions |
| `/api/drivers/[id]/location` | PATCH | Driver | Update current GPS coordinates |
| `/api/alerts` | GET | Admin | Live alert feed |
| `/api/analytics/kpi` | GET | Admin | KPI metrics aggregation |
| `/api/analytics/heatmap` | GET | Admin | Geo-aggregated fill data for heatmap |
| `/api/analytics/overview` | GET | Admin | System-wide statistics |
| `/api/citizens/[id]/rewards` | GET/POST | Citizen | Points balance and transactions |
| `/api/ai/insights` | GET | Admin | Gemini-generated operational insights |
| `/api/ai/predict` | POST | Admin | Fill level prediction for a bin |
| `/api/priority` | POST | Internal | Trigger priority recalculation |
| `/api/cron/priority` | GET | Vercel Cron | Scheduled priority recalculation (every 5 min) |
| `/api/cron/alerts` | GET | Vercel Cron | Scheduled alert sweep (every 2 min) |

---

## 10. Features — Small to Large

Here is a granular breakdown of every feature, from the smallest micro-detail to the largest system capability.

### Micro-Level Details
- Custom SVG bin markers on the map with color coding by status (green / yellow / orange / red / grey)
- `Fira Code` monospace font used exclusively for sensor IDs, coordinates, timestamps, fill percentages, route IDs, complaint IDs, and any technical data
- Soft-tint status chips (not solid color blocks) — success-container, warning-container, error-container backgrounds with matching text colors
- Base-8 spacing grid throughout — only values divisible by 4 or 8 are used (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px)
- Ambient-only shadows (no heavy grey smudges) — depth is created via surface color nesting
- No 1px divider lines between content sections — boundaries defined by background color tier shifts
- Prisma client implemented as a singleton to prevent multiple DB connections in serverless
- All Leaflet map components loaded with `dynamic(..., { ssr: false })` to prevent SSR hydration errors
- Redis cache key per bin with 5-minute TTL (`bin:{id}`) — prevents redundant DB reads on high-traffic endpoints
- All API mutations rate-limited via Upstash Ratelimit middleware
- Content Security Policy headers configured in `next.config.ts`
- `next/image` used for all images — automatic optimization, lazy loading, and WebP conversion
- Google Fonts preloaded in `<head>` to eliminate FOUT (Flash of Unstyled Text)

### Component-Level Features
- **StatCard** — Animated KPI card with a `CountUp` number that increments from 0 when it scrolls into viewport. Has skeleton shimmer while loading.
- **ProgressRing** — SVG circular progress indicator used for bin fill levels, segregation compliance, and driver route adherence.
- **SkeletonCard / SkeletonTable / SkeletonMap / SkeletonStat** — Full shimmer skeleton system ("Boneyard-style") shown during every data fetch, never raw loading spinners.
- **ScrollReveal** — `IntersectionObserver`-powered wrapper that triggers fade + `translateY` entrance on scroll for any wrapped content.
- **MagneticButton** — Hero CTA buttons that respond to `mousemove` with a subtle magnetic pull effect.
- **GlowPulse** — Pulsing animated ring component used on bin markers and alert indicators.
- **ParticleField** — Canvas-based particle system for the landing page hero background, using `requestAnimationFrame`.
- **GradientText** — CSS animated gradient text for hero headlines.
- **NoiseBg** — SVG filter grain overlay at 3% opacity for texture on hero sections.
- **DataTable** — Fully sortable with alternating row backgrounds, no divider lines, clickable rows.
- **Modal** — Framer Motion `AnimatePresence` modal with backdrop blur.

### Panel-Level Features

#### Admin Panel
- Bento grid dashboard with variable-span cards
- Live bin status map with real-time marker updates
- Priority queue — ordered list of bins needing immediate collection, recalculated every 5 minutes
- Alert feed — live stream of overflow, critical, sensor-offline, and route-delay events
- Route management — view all active routes, trigger VRP re-optimization, see animated path drawing on map
- Driver tracking — live GPS positions for all active drivers on map
- Complaint triage — view, assign, prioritize, and resolve citizen complaints
- KPI analytics — fill level trends over time, zone-by-zone performance comparison, collection compliance charts
- Heatmap view — Leaflet heatmap layer showing overflow density across the city
- AI Insights panel — Gemini-generated 3-point operational summary with actionable recommendations
- Emergency Mode — toggle that activates city-wide priority override and special routing
- Zone analytics — aggregated ratings, complaint counts, and fill averages per zone
- Settings — system configuration for alert thresholds, cron schedules, API key management

#### Driver Panel
- Today's route with stop list, sequence numbers, and expected time per stop
- Active navigation map centered on current position
- QR code scanner — camera-based scan with real-time API confirmation
- Offline scan queue — scans saved to IndexedDB when offline, auto-synced on reconnect via Background Sync API
- Offline banner shown automatically when network is lost
- Personal performance dashboard — bins collected today, route adherence %, average time per bin
- Historical collection log — searchable by date

#### Citizen Panel
- Ward-level collection schedule and next pickup time
- Complaint submission form with fields: title, description, category, optional photo upload (Cloudinary), optional GPS auto-detect
- Complaint tracker — list of own complaints with status chips and last updated time
- Nearby bin map — interactive Leaflet map showing bins within 1km radius with their fill levels
- Area rating widget — star rating (1–5) with optional text comment, submitted per zone
- Rewards dashboard — total points, recent transactions, unlocked badges
- Gamification badges: First Report, Active Citizen, Green Champion, Zone Guardian

#### Public Panel
- Canvas particle hero with title type-in animation and stat counter reveal
- Live city stats strip — real-time counts of bins monitored, active drivers, collections performed today (updates via polling)
- Interactive Leaflet map — publicly accessible, shows all bins colored by status
- Guest complaint form — minimal fields, no login required, CAPTCHA-free
- Feature showcase bento grid explaining platform capabilities
- Cinematic About page — scrolling timeline with `IntersectionObserver`-triggered section reveals

### System-Level Features
- **Smart Priority Engine** — Multi-factor scoring formula per bin:
  `score = (fillLevel × 0.4) + (hoursSinceLastCollection × 0.25) + (zoneWeight × 0.2) + (complaintCount × 0.1) + (nearOverflow × 0.05)`
- **VRP Route Optimizer** — Python OR-Tools solver triggered on-demand or nightly. Takes all bins above threshold, groups by zone, solves optimal pickup sequence minimizing total distance.
- **Fill Level Predictor** — scikit-learn regression model trained on telemetry history to predict when a bin will reach critical fill, enabling pre-emptive collection scheduling.
- **Real-Time WebSockets** — Ably channels: `bins:updates` (telemetry pushes), `alerts:live` (new alerts), `drivers:location` (GPS position updates), `routes:updates` (route assignment changes).
- **Vercel Cron Jobs** — `/api/cron/priority` runs every 5 minutes, `/api/cron/alerts` runs every 2 minutes.
- **IoT Ingestion Pipeline** — Sensor → `POST /api/bins/telemetry` (API key validated via Redis) → Prisma telemetry write → Priority recalc → Bin status update → Redis cache refresh → Ably push → Alert creation if critical.
- **Role-Based Access Control** — All admin and driver routes are server-side protected via NextAuth session. Unauthorized access redirects to login with `callbackUrl`.
- **Complaint Lifecycle** — OPEN → IN_PROGRESS (on assignment) → RESOLVED (on driver/staff confirmation) → CLOSED (on citizen acknowledgment) → ESCALATED (if unresolved beyond SLA).

---

## 11. Design System

WasteIQ uses the **"Civic Sentinel"** design language — a light-only theme emphasizing clarity, authority, and civic trust.

### Color Tokens

```css
:root {
  /* Brand */
  --primary:             #006D39;   /* Deep emerald — authority, CTAs */
  --primary-container:   #00C16A;   /* Vivid emerald — highlights */
  --secondary:           #006591;   /* Technical sky blue */
  --secondary-container: #39B8FD;   /* Interactive secondary */
  --tertiary:            #9D4300;   /* Cautionary amber */
  --tertiary-container:  #FF8842;   /* Alert/attention */

  /* Surfaces */
  --surface:             #F6FAFE;   /* App floor */
  --surface-low:         #F0F4F8;   /* Section groupings */
  --surface-lowest:      #FFFFFF;   /* Cards */
  --surface-high:        #E4E9ED;   /* Inset details, hover */

  /* Text */
  --on-surface:          #171C1F;   /* Primary text */
  --on-surface-variant:  #3F4948;   /* Secondary text */
  --outline:             #6F7978;
  --outline-variant:     #BEC9C7;

  /* Semantic */
  --error:               #BA1A1A;
  --success:             #006D39;
  --warning:             #9D4300;
  --info:                #006591;
}
```

### Typography — Three-Font System

| Font | Usage |
|---|---|
| **Plus Jakarta Sans** (300–800) | All headings, Display through Headline scale |
| **Work Sans** (400–600) | Body text, labels, UI controls, buttons |
| **Fira Code** (400–500) | All IDs, timestamps, sensor values, coordinates, percentages |

### Typography Scale

| Style | Font | Size | Weight |
|---|---|---|---|
| Display-Lg | Plus Jakarta Sans | 57px | 800 |
| Display-Md | Plus Jakarta Sans | 45px | 700 |
| Headline-Lg | Plus Jakarta Sans | 32px | 700 |
| Headline-Md | Plus Jakarta Sans | 28px | 600 |
| Title-Lg | Work Sans | 22px | 600 |
| Body-Lg | Work Sans | 16px | 400 |
| Mono-Md | Fira Code | 14px | 500 |

### Rules
- The entire platform is **light-themed only**. No dark mode, no dark panels, no exceptions.
- No 1px solid borders between content sections — tonal surface shifts define boundaries.
- No pure black (`#000000`) text anywhere — primary text uses `#171C1F`.
- Ambient-only shadows — no heavy grey smudges.
- Status chips use soft container tints, never solid block colors.

---

## 12. Animation System

Every state change, every data update, and every user interaction is accompanied by a purposeful animation. "No animation" is never acceptable in this codebase.

### Easing Functions

```css
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);   /* Primary — snappy spring */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);     /* Transitions */
--ease-out:    cubic-bezier(0, 0, 0.2, 1);        /* Exits */
--ease-in:     cubic-bezier(0.4, 0, 1, 1);        /* Entrances */
```

### Duration Scale

| Category | Duration |
|---|---|
| Micro (hover, focus) | 150ms |
| Short (button press) | 200ms |
| Medium (card reveal) | 300–400ms |
| Long (page element / skeleton → data) | 500–700ms |
| Cinematic (hero, about page) | 800–1200ms |

### The 7 WOW Moments

Every user's journey through the platform has seven unforgettable beats:

1. **Landing hero load** — Particles emerge from void, title types itself in, stat counters animate up from zero.
2. **Map reveal** — City map fades in with a ripple from center, bin markers appear with staggered pop animations.
3. **Dashboard load** — Skeleton shimmer transitions to data materializing with spring-physics card reveals.
4. **Alert trigger** — Pulsing red glow ring spreads from the affected bin on the map, notification slides in from the right.
5. **Route optimization** — Animated pathfinding lines draw themselves across the map as the VRP result renders.
6. **About page scroll** — Timeline sections animate in section by section as the user scrolls down.
7. **Complaint submitted** — Checkmark SVG draws itself, branded confetti falls in `--primary-container` green.

### Page Transitions
Every route change triggers: fade + 8px `translateY` exit (150ms, ease-in), followed by fade + 8px `translateY` entrance (300ms, ease-spring). Implemented via Framer Motion `AnimatePresence` with `mode="wait"`.

---

## 13. Real-Time Features

WasteIQ uses **Ably** (free tier: 6M messages/month) for WebSocket real-time communication.

### Ably Channels

| Channel | Events | Subscribers |
|---|---|---|
| `bins:updates` | `telemetry` — fill level, status, priority score | Admin dashboard, public map |
| `alerts:live` | `new-alert` — overflow, critical, sensor offline | Admin alert feed |
| `drivers:location` | `position` — lat/lng update | Admin driver map |
| `routes:updates` | `assigned`, `completed`, `emergency` | Driver app |

### Server → Client Push
When an IoT sensor reports a bin at >90% fill, the following cascade happens in under 2 seconds:
1. Telemetry logged to DB
2. Bin status updated to `OVERFLOW`
3. Priority score recalculated
4. Redis cache updated
5. Ably push sent to `bins:updates` and `alerts:live`
6. Admin map marker turns red in real time
7. Alert appears in admin alert feed in real time
8. Alert entry created in DB

---

## 14. IoT & Sensor Integration

WasteIQ supports real smart bin hardware via a secure telemetry ingestion endpoint.

### Telemetry Payload
```json
{
  "binId": "cm_abc123",
  "apiKey": "bin-secret-key",
  "fillLevel": 87.4,
  "weight": 42.1,
  "temperature": 31.2,
  "humidity": 68.5,
  "battery": 91.0
}
```

### Security
- Each bin has a unique API key stored in Redis (`bin:apikey:{binId}`)
- Endpoint validates key before processing any payload
- Malformed payloads rejected with 400 via Zod schema validation
- Rate limited per bin ID

### Simulation Mode
In development and demo environments, a simulator script sends randomized telemetry to the endpoint at configurable intervals, mimicking a real IoT deployment.

---

## 15. AI & Prediction Engine

### Google Gemini Insights
On demand via the Admin AI Insights panel, WasteIQ calls the **Gemini 1.5 Flash** model (free tier) with a real-time operational snapshot:
- Number of overflow incidents today
- City-wide average bin fill level
- Top stressed zones by name
- Citizen complaint count for the day

Gemini returns 3 structured, actionable operational insights in JSON format, each with: `title`, `insight`, `action`, and `severity` (low / medium / high). These are displayed in the admin AI panel as cards.

### Fill Level Prediction
A **scikit-learn** linear regression model is trained on historical `BinTelemetry` records per bin. Given a bin ID, it predicts the number of hours until the bin reaches a user-configurable critical threshold. Admins can view predicted overflow times per zone on the analytics page. This enables pre-emptive scheduling — dispatching a truck before a bin overflows, not after.

---

## 16. Route Optimization (VRP)

WasteIQ implements a full **Vehicle Routing Problem** solver using **Google OR-Tools** in a Python serverless function.

### Algorithm
1. Admin triggers optimization from the Routes page (or it runs nightly via Vercel Cron).
2. All bins with `priorityScore` above a configurable threshold are fetched.
3. Bins are grouped by zone.
4. OR-Tools constructs a distance matrix from GPS coordinates.
5. VRP solver minimizes total route distance across all available drivers.
6. Optimal stop sequences are written as `RouteStop` records in the DB.
7. Ably pushes new route assignments to each driver's app in real time.
8. Animated pathfinding lines draw the optimized routes on the admin map.

### Impact
Compared to fixed schedule routing, VRP typically reduces total route distance by 20–35%, saving fuel and time.

---

## 17. Smart Priority Engine

Every bin has a continuously updated `priorityScore` (0–100) calculated from multiple factors:

```
Priority Score =
  (fillLevel          × 0.40) +
  (hoursSinceLastCollection × 0.25) +
  (zoneLocationWeight × 0.20) +
  (relatedComplaintCount × 0.10) +
  (nearOverflowBonus  × 0.05)
```

- **fillLevel** — Raw sensor reading. 100% fill = maximum contribution.
- **hoursSinceLastCollection** — Bins not collected recently get higher urgency even if not yet full.
- **zoneLocationWeight** — Hospitals and markets (1.8×) are prioritized over residential zones (1.0×).
- **complaintCount** — Bins near frequently complained areas get urgency boost.
- **nearOverflowBonus** — Binary flag if neighboring bins are also near critical.

The engine runs on every telemetry event and every 5 minutes via Vercel Cron. The Admin Priority Queue always shows bins sorted by this score descending.

---

## 18. Authentication & Role-Based Access

### Provider Support
- **Email/Password** — bcrypt hashed (12 rounds), NextAuth credentials provider
- **Google OAuth** — Single click via NextAuth Google provider
- **Phone + OTP** — Resend email delivery (can be extended to SMS)

### Roles
| Role | Access |
|---|---|
| `SUPER_ADMIN` | All admin pages + settings + user management |
| `ADMIN` | All admin pages except user management |
| `DRIVER` | Driver panel only |
| `CITIZEN` | Citizen panel only |
| Public | Landing page + public map + guest complaint form |

### Guards
All protected routes use Next.js middleware and server-side session checks. Unauthorized requests are redirected to `/login?callbackUrl=...` and return to the original page after successful authentication.

---

## 19. Map System

WasteIQ uses **Leaflet** and **React-Leaflet** — completely free, no API key ever needed.

### Tile Providers
- **OpenStreetMap** — Default, free with attribution
- **CartoDB Dark Matter** — Alternative dark tiles for admin dashboard (free)

### Map Layers & Plugins
| Layer | Plugin | Purpose |
|---|---|---|
| Heatmap | `leaflet.heat` | Overflow density visualization |
| Bin clustering | `leaflet.markercluster` | Group bin markers at low zoom levels |
| Route polylines | `leaflet-routing-machine` | Draw optimized routes on map |
| Zone boundaries | `leaflet-draw` | Admin can draw and edit zone polygons |

### Bin Marker Colors
| Status | Color |
|---|---|
| NORMAL | Green (`--success`) |
| WARNING | Amber (`--warning`) |
| CRITICAL | Orange (`--tertiary-container`) |
| OVERFLOW | Red (`--error`) |
| OFFLINE | Grey (`--outline`) |
| MAINTENANCE | Blue (`--info`) |

---

## 20. Offline & PWA Support

The **Driver Panel** is a Progressive Web App (PWA) — installable on mobile and functional without internet.

### Offline-Cached Routes
- `/driver`
- `/driver/route`
- `/driver/scan`

### Offline QR Scan Flow
1. Driver scans bin QR while offline.
2. Scan data stored in **IndexedDB**: `{ binId, action, timestamp, lat, lng, driverId }`.
3. UI shows offline banner and a "Queued" badge on the scan confirmation screen.
4. On network restoration, **Background Sync API** automatically flushes queued scans to `/api/bins/scan`.
5. Success toast confirms sync completion.

---

## 21. Security

| Layer | Mechanism |
|---|---|
| Passwords | bcrypt, salt rounds 12 |
| SQL Injection | Impossible — Prisma uses parameterized queries |
| XSS | Next.js escapes by default; no `dangerouslySetInnerHTML` |
| CSRF | Handled by NextAuth |
| Rate Limiting | Upstash Ratelimit on all mutation endpoints |
| IoT Auth | Per-bin API key validated from Redis |
| File Uploads | Cloudinary handles MIME validation; max 5MB enforced |
| Environment Variables | No secrets exposed to client — `NEXT_PUBLIC_` prefix only for truly public values |
| Content Security Policy | Configured in `next.config.ts` |
| HTTPS | Enforced by Vercel — no HTTP |

---

## 22. Performance & Caching

| Strategy | Implementation |
|---|---|
| Redis caching | Bin state cached with 5-minute TTL; KPI aggregations cached with 10-minute TTL |
| Static Generation | Public pages use ISR (Incremental Static Regeneration) with 10-minute revalidation |
| Map code splitting | Leaflet loaded with `dynamic(..., { ssr: false })` — not in server bundle |
| Image optimization | All images via `next/image` — WebP conversion, responsive sizes, lazy loading |
| Font preloading | Google Fonts `<link rel="preload">` in root layout — zero FOUT |
| Singleton DB client | Prisma client is a global singleton — prevents connection pool exhaustion in serverless |
| Bundle optimization | No unused imports; tree-shaking via TypeScript strict mode |

---

## 23. Error Handling & Monitoring

### API Routes
Every API route is wrapped in `try/catch`. Errors are captured to **Sentry** and return structured JSON responses:
```json
{ "error": "Internal server error", "code": 500 }
```

### Client-Side
- `error.tsx` — Next.js error boundary catches unhandled client errors, shows styled 500 page with Sentry event ID.
- `not-found.tsx` — Custom 404 page with navigation back to landing.
- Toast notifications — Sonner toast with error icon, auto-dismiss after 5 seconds.

### Monitoring
- **Sentry** — Error tracking with stack traces, free tier: 5K errors/month.
- **Vercel Analytics** — Core Web Vitals, LCP, FID, CLS monitoring.

---

## 24. Deployment

WasteIQ deploys to **Vercel** (free hobby tier). Vercel provides:
- Serverless function execution for all API routes
- Edge CDN for static assets
- Automatic HTTPS
- Preview deployments on every pull request
- Cron job scheduling via `vercel.json`

### Cron Configuration (`vercel.json`)
```json
{
  "crons": [
    { "path": "/api/cron/priority", "schedule": "*/5 * * * *" },
    { "path": "/api/cron/alerts",   "schedule": "*/2 * * * *" }
  ]
}
```

---

## 25. Environment Variables

Create a `.env.local` file in the project root with all of the following:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-32-char-secret

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Ably (WebSockets)
ABLY_API_KEY=
NEXT_PUBLIC_ABLY_API_KEY=

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend (Email)
RESEND_API_KEY=

# Google Gemini (AI)
GEMINI_API_KEY=

# IoT Auth
IOT_MASTER_KEY=

# Error Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

All values (except those prefixed `NEXT_PUBLIC_`) are server-only and never exposed to the browser bundle.

---

## 26. Local Setup & Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A Neon PostgreSQL account (free)
- An Upstash account (free)
- An Ably account (free)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/RyanKeshary/wasteIQ.git
cd wasteIQ

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill all values

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database
npx prisma db push

# 6. Seed with realistic mock data
npx prisma db seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

### Default Seeded Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@wasteiq.in | admin123 |
| Driver 1 | driver1@wasteiq.in | driver123 |
| Driver 2 | driver2@wasteiq.in | driver123 |

### Production Build

```bash
npm run build
npm run start

# Or deploy to Vercel
vercel deploy --prod
```

---

## 27. Database Seeding

Running `npx prisma db seed` creates a realistic starting dataset:

- **5 zones** — Mira Road East (residential), Bhayandar Market (market), Shanti Nagar (residential), Kamothe Naka (commercial), Coastal Strip (coastal).
- **50 bins** — Distributed across zones with randomized fill levels, statuses, and QR codes (`QR-MB-0001` through `QR-MB-0050`). Bins above 90% fill are seeded as `OVERFLOW`, 75–90% as `CRITICAL`, 60–75% as `WARNING`.
- **1 admin user** — `admin@wasteiq.in` / `admin123`
- **5 driver users** — `driver1@wasteiq.in` through `driver5@wasteiq.in` / `driver123`. Each with a vehicle number in the `MH04-XXXX` format.

Bin GPS coordinates are distributed realistically around Mira-Bhayandar (lat ~19.258, lng ~72.845) with random offsets.

---

## 28. Roadmap & Future Scope

### Phase 1 — Pilot (Months 1–2)
Single zone deployment. All four panels live. IoT simulation mode active. Admin and Driver panels fully operational.

### Phase 2 — City-Wide (Months 3–4)
All 12 municipal zones. Real IoT hardware integration. Citizen rewards program launch. Route optimizer running nightly with real data.

### Phase 3 — Intelligence (Months 5–6)
Gemini AI insights running in production. Fill prediction model trained on real accumulated data. Predictive alerts (pre-empting overflows hours in advance). Driver performance gamification leaderboards.

### Phase 4 — Expansion
- **Multi-city support** — Configurable per-city zones, branding, and thresholds.
- **Native mobile apps** — React Native apps for Driver and Citizen panels.
- **Computer vision** — Overflow detection via bin-mounted cameras using image classification.
- **Carbon credit tracking** — Measure and report CO₂ saved per optimized collection route.
- **Smart bin hardware kit** — Reference hardware design (ESP32 + ultrasonic sensor + SIM module) for municipalities to deploy.
- **WhatsApp/SMS notifications** — Proactive alerts to citizens about collection schedules and complaint updates.
- **NFC support** — Alternative to QR codes for driver bin verification.
- **Open API** — Public API for third-party civic apps to consume live bin data.

---

## 29. Project Info

| Field | Detail |
|---|---|
| **Project Name** | WasteIQ |
| **Author** | Ryan Keshary |
| **Roll No.** | 80 |
| **Institution** | SLRTCE — Shree L. R. Tiwari College of Engineering |
| **Department** | Computer Engineering |
| **Program** | IDEA LAB-II |
| **Academic Year** | 2025–26 |
| **Live URL** | [wasteiq-phi.vercel.app](https://wasteiq-phi.vercel.app) |
| **Repository** | [github.com/RyanKeshary/wasteIQ](https://github.com/RyanKeshary/wasteIQ) |
| **License** | Private |

---

> *"Start implementing."*
> — When you say those words, this platform gives you everything: the schema, the APIs, the components, the effects, the skeleton screens, the AI integration, and the deployment config. Every tool is free. Every effect is coded. Every experience is designed.
> **WasteIQ is ready.**