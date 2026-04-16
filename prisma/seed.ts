/**
 * WasteIQ — Database Seed Script
 */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `${process.cwd()}/.env` });

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'wasteiq2026';

async function main() {
  console.log('🌱 Seeding WasteIQ database...');

  // 1. ZONES 
  const zones = await Promise.all([
    prisma.zone.create({ data: { name: 'Mira Road (East)', type: 'RESIDENTIAL', locationWeight: 1.2 } }),
    prisma.zone.create({ data: { name: 'Bhayandar Market', type: 'MARKET', locationWeight: 1.5 } }),
    prisma.zone.create({ data: { name: 'Kashimira', type: 'COMMERCIAL', locationWeight: 1.3 } }),
    prisma.zone.create({ data: { name: 'Shanti Nagar', type: 'RESIDENTIAL', locationWeight: 1.0 } }),
    prisma.zone.create({ data: { name: 'Coastal Strip', type: 'COASTAL', locationWeight: 0.8 } }),
  ]);
  console.log(` ✅ ${zones.length} zones created`);

  // 2. ADMIN USERS
  const passwordHash = await hash(DEFAULT_PASSWORD, 12);
  await prisma.user.create({
    data: {
      email: 'admin@wasteiq.in',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(` ✅ Admin user created`);

  // 3. DRIVERS
  const driverData = [
    { name: 'Pradeep Kumar', email: 'pradeep@wasteiq.in', employeeId: 'DRV-001', vehicle: 'MH-04-AB-1234' },
  ];
  for (const d of driverData) {
    const user = await prisma.user.create({
      data: { email: d.email, name: d.name, passwordHash, role: 'DRIVER' },
    });
    await prisma.driver.create({
      data: { userId: user.id, employeeId: d.employeeId, vehicleNumber: d.vehicle },
    });
  }
  console.log(` ✅ Drivers created`);

  // 4. BINS
  for (let i = 0; i < 10; i++) {
    await prisma.bin.create({
      data: {
        qrCode: `WIQ-${String(i + 1).padStart(4, '0')}`,
        latitude: 19.27 + Math.random() * 0.04,
        longitude: 72.83 + Math.random() * 0.04,
        address: `Sample Address ${i + 1}`,
        zoneId: zones[i % zones.length].id,
        status: 'NORMAL',
      },
    });
  }
  console.log(` ✅ Bins created`);

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
