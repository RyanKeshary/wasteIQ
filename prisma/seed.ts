/**
 * WasteIQ — Database Seed Script
 * Creates: 5 zones, 50 bins, 5 drivers, 3 admin users, 5 citizen users,
 * sample complaints, alerts, routes, telemetry.
 *
 * Usage: npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'wasteiq2025';

async function main() {
  console.log('🌱 Seeding WasteIQ database...');

  // ── 1. ZONES ───────────────────────────────────────────────

  const zones = await Promise.all([
    prisma.zone.create({
      data: { name: 'Mira Road (East)', type: 'RESIDENTIAL', locationWeight: 1.2 },
    }),
    prisma.zone.create({
      data: { name: 'Bhayandar Market', type: 'MARKET', locationWeight: 1.5 },
    }),
    prisma.zone.create({
      data: { name: 'Kashimira', type: 'COMMERCIAL', locationWeight: 1.3 },
    }),
    prisma.zone.create({
      data: { name: 'Shanti Nagar', type: 'RESIDENTIAL', locationWeight: 1.0 },
    }),
    prisma.zone.create({
      data: { name: 'Coastal Strip', type: 'COASTAL', locationWeight: 0.8 },
    }),
  ]);
  console.log(`  ✅ ${zones.length} zones created`);

  // ── 2. ADMIN USERS ─────────────────────────────────────────

  const passwordHash = await hash(DEFAULT_PASSWORD, 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@wasteiq.in',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'wardofficer@wasteiq.in',
      name: 'Ward Officer Raj',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`  ✅ 2 admin users created`);

  // ── 3. DRIVER USERS ────────────────────────────────────────

  const driverData = [
    { name: 'Pradeep Kumar', email: 'pradeep@wasteiq.in', employeeId: 'DRV-001', vehicle: 'MH-04-AB-1234' },
    { name: 'Rajesh Mehta', email: 'rajesh@wasteiq.in', employeeId: 'DRV-002', vehicle: 'MH-04-CD-5678' },
    { name: 'Suresh Patil', email: 'suresh@wasteiq.in', employeeId: 'DRV-003', vehicle: 'MH-04-EF-9012' },
    { name: 'Anil Verma', email: 'anil@wasteiq.in', employeeId: 'DRV-004', vehicle: 'MH-04-GH-3456' },
    { name: 'Manoj Singh', email: 'manoj@wasteiq.in', employeeId: 'DRV-005', vehicle: 'MH-04-IJ-7890' },
  ];

  const drivers = [];
  for (const d of driverData) {
    const user = await prisma.user.create({
      data: {
        email: d.email,
        name: d.name,
        passwordHash,
        role: 'DRIVER',
      },
    });
    const driver = await prisma.driver.create({
      data: {
        userId: user.id,
        employeeId: d.employeeId,
        vehicleNumber: d.vehicle,
        currentLat: 19.28 + Math.random() * 0.02,
        currentLng: 72.84 + Math.random() * 0.02,
        lastLocationAt: new Date(),
      },
    });
    drivers.push(driver);
  }
  console.log(`  ✅ ${drivers.length} drivers created`);

  // ── 4. CITIZEN USERS ───────────────────────────────────────

  const citizenData = [
    { name: 'Amit Sharma', email: 'amit@example.com', ward: 'W-14' },
    { name: 'Priya Nair', email: 'priya@example.com', ward: 'W-08' },
    { name: 'Vikram Desai', email: 'vikram@example.com', ward: 'W-12' },
    { name: 'Neha Kulkarni', email: 'neha@example.com', ward: 'W-06' },
    { name: 'Ravi Patel', email: 'ravi@example.com', ward: 'W-02' },
  ];

  const citizens = [];
  for (const c of citizenData) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        name: c.name,
        passwordHash,
        role: 'CITIZEN',
      },
    });
    const citizen = await prisma.citizen.create({
      data: {
        userId: user.id,
        ward: c.ward,
        points: Math.floor(Math.random() * 500),
      },
    });
    citizens.push(citizen);
  }
  console.log(`  ✅ ${citizens.length} citizen users created`);

  // ── 5. BINS (50 bins across 5 zones) ───────────────────────

  const binAddresses = [
    'Station Road', 'Market Lane', 'Highway Junction', 'Garden Colony',
    'Coastal Road', 'Temple Street', 'School Road', 'Hospital Lane',
    'Park Avenue', 'Nagar Rd',
  ];

  const bins = [];
  for (let i = 0; i < 50; i++) {
    const zone = zones[i % zones.length];
    const fillLevel = Math.random() * 100;
    const status =
      fillLevel > 90 ? 'OVERFLOW' :
      fillLevel > 75 ? 'CRITICAL' :
      fillLevel > 60 ? 'WARNING' : 'NORMAL';
    const wasteTypes: Array<'MIXED' | 'WET' | 'DRY' | 'HAZARDOUS' | 'RECYCLABLE'> = 
      ['MIXED', 'WET', 'DRY', 'HAZARDOUS', 'RECYCLABLE'];

    const bin = await prisma.bin.create({
      data: {
        qrCode: `WIQ-${String(i + 1).padStart(4, '0')}`,
        latitude: 19.27 + Math.random() * 0.04,
        longitude: 72.83 + Math.random() * 0.04,
        address: `${binAddresses[i % binAddresses.length]}, ${zone.name}`,
        zoneId: zone.id,
        capacity: 100,
        currentFill: Math.round(fillLevel * 100) / 100,
        sensorHealth: Math.random() > 0.1,
        priorityScore: Math.round(Math.random() * 100),
        status,
        type: wasteTypes[i % wasteTypes.length],
        lastCollectedAt: new Date(Date.now() - Math.random() * 86400000 * 3),
      },
    });
    bins.push(bin);
  }
  console.log(`  ✅ ${bins.length} bins created`);

  // ── 6. TELEMETRY (5 readings per bin = 250 records) ────────

  let telemetryCount = 0;
  for (const bin of bins) {
    for (let t = 0; t < 5; t++) {
      await prisma.binTelemetry.create({
        data: {
          binId: bin.id,
          fillLevel: Math.max(0, bin.currentFill - (5 - t) * Math.random() * 10),
          weight: Math.random() * 50,
          temperature: 25 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          batteryLevel: 20 + Math.random() * 80,
          timestamp: new Date(Date.now() - (5 - t) * 3600000),
        },
      });
      telemetryCount++;
    }
  }
  console.log(`  ✅ ${telemetryCount} telemetry records created`);

  // ── 7. ROUTES (5 routes, 1 per driver) ─────────────────────

  const routeStatuses: Array<'PENDING' | 'ACTIVE' | 'COMPLETED'> = 
    ['ACTIVE', 'ACTIVE', 'COMPLETED', 'PENDING', 'COMPLETED'];

  const routes = [];
  for (let r = 0; r < drivers.length; r++) {
    const route = await prisma.route.create({
      data: {
        driverId: drivers[r].id,
        zoneId: zones[r].id,
        date: new Date(),
        status: routeStatuses[r],
        totalDistance: 8 + Math.random() * 12,
        estimatedTime: 120 + Math.random() * 60,
        startedAt: routeStatuses[r] !== 'PENDING' ? new Date(Date.now() - 7200000) : null,
        completedAt: routeStatuses[r] === 'COMPLETED' ? new Date() : null,
      },
    });

    // Add 10 stops per route
    const zoneBins = bins.filter((b) => b.zoneId === zones[r].id);
    for (let s = 0; s < Math.min(10, zoneBins.length); s++) {
      await prisma.routeStop.create({
        data: {
          routeId: route.id,
          binId: zoneBins[s].id,
          sequence: s + 1,
          status: routeStatuses[r] === 'COMPLETED' ? 'COMPLETED' : s < 5 ? 'COMPLETED' : 'PENDING',
          arrivedAt: s < 5 ? new Date(Date.now() - (10 - s) * 600000) : null,
          completedAt: s < 5 ? new Date(Date.now() - (10 - s) * 600000 + 120000) : null,
        },
      });
    }
    routes.push(route);
  }
  console.log(`  ✅ ${routes.length} routes created with stops`);

  // ── 8. COMPLAINTS ──────────────────────────────────────────

  const complaintData = [
    { title: 'Overflowing bin near station', desc: 'The bin at Station Road is overflowing since morning. Foul smell reported.', priority: 1, status: 'OPEN' as const },
    { title: 'Missed collection on Market Lane', desc: 'Collection was scheduled for yesterday but the truck never came.', priority: 2, status: 'IN_PROGRESS' as const },
    { title: 'Illegal dumping at highway junction', desc: 'Construction waste being dumped illegally at this location.', priority: 1, status: 'OPEN' as const },
    { title: 'Unsanitary area near Garden Colony', desc: 'Open waste near the children park. Health hazard for residents.', priority: 2, status: 'RESOLVED' as const },
    { title: 'Overflowing bin on Coastal Road', desc: 'Bin has been full for 2 days. Tourist area — needs urgent attention.', priority: 1, status: 'IN_PROGRESS' as const },
  ];

  for (let c = 0; c < complaintData.length; c++) {
    await prisma.complaint.create({
      data: {
        title: complaintData[c].title,
        description: complaintData[c].desc,
        priority: complaintData[c].priority,
        status: complaintData[c].status,
        citizenId: citizens[c].id,
        binId: bins[c * 10].id,
        latitude: 19.28 + Math.random() * 0.02,
        longitude: 72.84 + Math.random() * 0.02,
        resolvedAt: complaintData[c].status === 'RESOLVED' ? new Date() : null,
      },
    });
  }
  console.log(`  ✅ ${complaintData.length} complaints created`);

  // ── 9. ALERTS ──────────────────────────────────────────────

  const alertData: Array<{ type: 'OVERFLOW' | 'CRITICAL_FILL' | 'SENSOR_OFFLINE' | 'ROUTE_DELAY'; message: string; severity: number }> = [
    { type: 'OVERFLOW', message: 'Bin WIQ-0042 has reached 98% capacity in Kashimira', severity: 1 },
    { type: 'CRITICAL_FILL', message: 'Bin WIQ-0015 approaching overflow threshold (85%) in Bhayandar Market', severity: 2 },
    { type: 'SENSOR_OFFLINE', message: 'Sensor offline: WIQ-0038 — last telemetry 4h ago in Shanti Nagar', severity: 2 },
    { type: 'ROUTE_DELAY', message: 'Driver Pradeep delayed by 22 min on Route in Mira Road (East)', severity: 3 },
    { type: 'OVERFLOW', message: 'Bin WIQ-0007 overflowing in Coastal Strip — tourist zone alert', severity: 1 },
  ];

  for (const a of alertData) {
    await prisma.alert.create({
      data: {
        type: a.type,
        message: a.message,
        severity: a.severity,
        binId: bins[Math.floor(Math.random() * bins.length)].id,
        zoneId: zones[Math.floor(Math.random() * zones.length)].id,
      },
    });
  }
  console.log(`  ✅ ${alertData.length} alerts created`);

  console.log('\n🎉 Seed complete!');
  console.log('─────────────────────────────────────');
  console.log('  Login Credentials:');
  console.log(`  Admin:   admin@wasteiq.in / ${DEFAULT_PASSWORD}`);
  console.log(`  Driver:  pradeep@wasteiq.in / ${DEFAULT_PASSWORD}`);
  console.log(`  Citizen: amit@example.com / ${DEFAULT_PASSWORD}`);
  console.log('─────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
