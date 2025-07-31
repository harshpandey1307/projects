import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      serialNumber: 'WM001234567',
      modelNumber: 'WM-2023-A1',
      brand: 'HomeTech',
      category: 'Washing Machine',
      name: 'HomeTech Auto Wash Pro',
      description: '7.5 kg Fully Automatic Top Loading Washing Machine',
      purchaseDate: new Date('2023-01-15'),
      warrantyEnd: new Date('2025-01-15'),
    },
  });

  const product2 = await prisma.product.create({
    data: {
      serialNumber: 'RF987654321',
      modelNumber: 'RF-2023-D2',
      brand: 'CoolFridge',
      category: 'Refrigerator',
      name: 'CoolFridge Double Door Pro',
      description: '300L Double Door Refrigerator with Digital Display',
      purchaseDate: new Date('2023-03-20'),
      warrantyEnd: new Date('2025-03-20'),
    },
  });

  const product3 = await prisma.product.create({
    data: {
      serialNumber: 'AC555666777',
      modelNumber: 'AC-2023-C3',
      brand: 'AirCool',
      category: 'Air Conditioner',
      name: 'AirCool Split AC Inverter',
      description: '1.5 Ton Split Air Conditioner with Inverter Technology',
      purchaseDate: new Date('2023-05-10'),
      warrantyEnd: new Date('2026-05-10'),
    },
  });

  // Create spare parts for washing machine
  await prisma.sparePart.createMany({
    data: [
      {
        productId: product1.id,
        partNumber: 'WM-PUMP-001',
        name: 'Water Pump Assembly',
        description: 'Original water pump for HomeTech washing machines',
        price: 1250.00,
        stock: 15,
        category: 'Motor & Pump',
      },
      {
        productId: product1.id,
        partNumber: 'WM-DOOR-001',
        name: 'Door Lock Assembly',
        description: 'Safety door lock mechanism',
        price: 850.00,
        stock: 8,
        category: 'Safety Parts',
      },
      {
        productId: product1.id,
        partNumber: 'WM-BELT-001',
        name: 'Drive Belt',
        description: 'V-belt for drum rotation',
        price: 320.00,
        stock: 25,
        category: 'Mechanical Parts',
      },
      {
        productId: product1.id,
        partNumber: 'WM-FILTER-001',
        name: 'Lint Filter',
        description: 'Washable lint filter',
        price: 180.00,
        stock: 30,
        category: 'Filters',
      },
    ],
  });

  // Create spare parts for refrigerator
  await prisma.sparePart.createMany({
    data: [
      {
        productId: product2.id,
        partNumber: 'RF-COMP-001',
        name: 'Compressor Unit',
        description: 'High efficiency compressor for cooling',
        price: 4500.00,
        stock: 5,
        category: 'Cooling System',
      },
      {
        productId: product2.id,
        partNumber: 'RF-THERMO-001',
        name: 'Thermostat',
        description: 'Temperature control thermostat',
        price: 680.00,
        stock: 12,
        category: 'Controls',
      },
      {
        productId: product2.id,
        partNumber: 'RF-GASKET-001',
        name: 'Door Gasket',
        description: 'Rubber door seal gasket',
        price: 420.00,
        stock: 18,
        category: 'Sealing Parts',
      },
      {
        productId: product2.id,
        partNumber: 'RF-SHELF-001',
        name: 'Glass Shelf',
        description: 'Tempered glass shelf',
        price: 950.00,
        stock: 10,
        category: 'Interior Parts',
      },
    ],
  });

  // Create spare parts for air conditioner
  await prisma.sparePart.createMany({
    data: [
      {
        productId: product3.id,
        partNumber: 'AC-FILTER-001',
        name: 'Air Filter',
        description: 'HEPA air filter for clean air',
        price: 280.00,
        stock: 40,
        category: 'Filters',
      },
      {
        productId: product3.id,
        partNumber: 'AC-REMOTE-001',
        name: 'Remote Control',
        description: 'Original remote control unit',
        price: 750.00,
        stock: 15,
        category: 'Controls',
      },
      {
        productId: product3.id,
        partNumber: 'AC-FAN-001',
        name: 'Indoor Fan Motor',
        description: 'Energy efficient fan motor',
        price: 1800.00,
        stock: 8,
        category: 'Motor & Fan',
      },
      {
        productId: product3.id,
        partNumber: 'AC-COIL-001',
        name: 'Evaporator Coil',
        description: 'Copper evaporator coil assembly',
        price: 2200.00,
        stock: 6,
        category: 'Cooling System',
      },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('Sample Serial Numbers for testing:');
  console.log('- WM001234567 (Washing Machine)');
  console.log('- RF987654321 (Refrigerator)');
  console.log('- AC555666777 (Air Conditioner)');
  console.log('You can use any 10-digit mobile number starting with 6-9 for testing.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });