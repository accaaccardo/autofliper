import { PrismaClient, FuelType, Transmission, BodyType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'marko@example.com' },
    update: {},
    create: {
      email: 'marko@example.com',
      name: 'Marko Petrović',
      password: hashedPassword,
      location: 'Belgrade, Serbia',
      bio: 'Car enthusiast looking to upgrade my ride!',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'ana@example.com' },
    update: {},
    create: {
      email: 'ana@example.com',
      name: 'Ana Jovanović',
      password: hashedPassword,
      location: 'Novi Sad, Serbia',
      bio: 'Looking for a practical family car exchange.',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'stefan@example.com' },
    update: {},
    create: {
      email: 'stefan@example.com',
      name: 'Stefan Nikolić',
      password: hashedPassword,
      location: 'Niš, Serbia',
    },
  });

  // Create listings with exchange data
  const listing1 = await prisma.listing.create({
    data: {
      userId: user1.id,
      title: '2019 BMW 3 Series 320d - Clean, Full Service History',
      make: 'BMW',
      model: '3 Series',
      year: 2019,
      mileage: 85000,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Mineral White',
      price: 28500,
      doors: 4,
      power: 140,
      engineSize: 2.0,
      description: 'Excellent condition BMW 320d with full service history. Recently serviced, new tires. All extras included. Non-smoker car. Available for test drive anytime.',
      features: ['Navigation', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'Bluetooth', 'Heated Seats', 'LED Headlights', 'Apple CarPlay'],
      openToExchange: true,
      lookingForMakes: ['Audi', 'Mercedes-Benz', 'Volkswagen'],
      lookingForModels: ['A4', 'A6', 'C-Class', 'Passat'],
      cashAdjustment: true,
      exchangeNotes: 'Open to slight price difference. Looking for similar year and condition.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800', order: 1 },
          { url: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800', order: 2 },
        ],
      },
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      userId: user2.id,
      title: '2020 Audi A4 2.0 TFSI - Sport Package, Fully Loaded',
      make: 'Audi',
      model: 'A4',
      year: 2020,
      mileage: 62000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Daytona Gray',
      price: 32000,
      doors: 4,
      power: 150,
      engineSize: 2.0,
      description: 'Stunning Audi A4 in Daytona Gray. Sport package with S-Line exterior. Low mileage, perfect condition. Full Audi service history. Looking for an exchange!',
      features: ['Virtual Cockpit', 'Matrix LED', 'S-Line Package', 'Bang & Olufsen Sound', 'Adaptive Cruise Control', 'Lane Assist', 'Wireless Charging'],
      openToExchange: true,
      lookingForMakes: ['BMW', 'Mercedes-Benz', 'Porsche'],
      lookingForModels: ['3 Series', '5 Series', 'C-Class', 'Macan'],
      cashAdjustment: true,
      exchangeNotes: 'Prefer similar segment. Can add cash up to 3000€.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', order: 1 },
        ],
      },
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      userId: user3.id,
      title: '2018 Mercedes-Benz C220d AMG Line - Like New',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2018,
      mileage: 98000,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Obsidian Black',
      price: 31000,
      doors: 4,
      power: 143,
      engineSize: 2.0,
      description: 'Immaculate C220d AMG Line. Never had any issues, always garaged. Two owner car with complete service records.',
      features: ['AMG Line', 'Burmester Sound', 'Panoramic Roof', 'Head-Up Display', 'Distronic Plus', 'Memory Seats'],
      openToExchange: true,
      lookingForMakes: ['BMW', 'Audi', 'Lexus'],
      lookingForModels: ['3 Series', 'A4', 'IS'],
      cashAdjustment: false,
      exchangeNotes: 'Straight swap only. Must be similar year and value.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800', order: 1 },
        ],
      },
    },
  });

  await prisma.listing.create({
    data: {
      userId: user1.id,
      title: '2021 Volkswagen Golf 8 GTI - 245hp, Low Miles',
      make: 'Volkswagen',
      model: 'Golf',
      year: 2021,
      mileage: 31000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.MANUAL,
      bodyType: BodyType.HATCHBACK,
      color: 'Tornado Red',
      price: 29500,
      doors: 5,
      power: 180,
      engineSize: 2.0,
      description: 'Brand new Golf 8 GTI. This is the hot hatch to have right now. Incredible performance meets everyday usability.',
      features: ['GTI Package', 'Dynaudio Sound', 'Digital Cockpit Pro', 'IQ.Drive', 'Wireless App-Connect'],
      openToExchange: true,
      lookingForMakes: ['BMW', 'Audi', 'Mercedes-Benz', 'Honda'],
      lookingForModels: ['M2', 'RS3', 'A45', 'Civic Type R'],
      cashAdjustment: true,
      exchangeNotes: 'Interested in performance cars. Happy to add cash for the right deal.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800', order: 0, isPrimary: true },
        ],
      },
    },
  });

  await prisma.listing.create({
    data: {
      userId: user2.id,
      title: '2017 Toyota Land Cruiser 200 - Full Option, Armored',
      make: 'Toyota',
      model: 'Land Cruiser',
      year: 2017,
      mileage: 120000,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Pearl White',
      price: 55000,
      doors: 5,
      power: 190,
      engineSize: 4.5,
      description: 'Legendary Land Cruiser 200 with full options. Extremely reliable, goes anywhere. Perfect for those who need a capable luxury SUV.',
      features: ['Mark Levinson Audio', 'Multi-Terrain Select', '4WD', 'Crawl Control', 'Air Suspension', '4-Zone Climate'],
      openToExchange: false,
      lookingForMakes: [],
      lookingForModels: [],
      cashAdjustment: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', order: 0, isPrimary: true },
        ],
      },
    },
  });

  await prisma.listing.create({
    data: {
      userId: user3.id,
      title: '2022 Tesla Model 3 Long Range - Autopilot',
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      mileage: 28000,
      fuelType: FuelType.ELECTRIC,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Midnight Silver',
      price: 38000,
      doors: 4,
      power: 258,
      description: 'Amazing Tesla Model 3 Long Range. Full self-driving capable. Supercharger access. Over-the-air updates always keeping it fresh.',
      features: ['Autopilot', 'Full Self-Driving', 'Premium Audio', 'Glass Roof', '560km Range', 'Supercharger Network'],
      openToExchange: true,
      lookingForMakes: ['BMW', 'Audi', 'Porsche', 'Mercedes-Benz'],
      lookingForModels: ['i4', 'e-tron', 'Taycan', 'EQC'],
      cashAdjustment: true,
      exchangeNotes: 'Looking for other premium EVs or plug-in hybrids.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', order: 0, isPrimary: true },
        ],
      },
    },
  });

  // Create a match between listing1 (BMW wants Audi) and listing2 (Audi wants BMW)
  await prisma.match.create({
    data: {
      listing1Id: listing1.id,
      listing2Id: listing2.id,
      user1Id: user1.id,
      user2Id: user2.id,
      status: 'PENDING',
    },
  });

  console.log('✅ Seed complete!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.listing.count()} listings`);
  console.log(`Created ${await prisma.match.count()} matches`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
