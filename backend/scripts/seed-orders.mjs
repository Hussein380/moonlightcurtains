import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test Orders and Custom Requests into MongoDB...");

  // Seed Orders
  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-001" },
    update: {},
    create: {
      orderNumber: "ORD-2026-001",
      customerName: "Jane Tester",
      phoneNumber: "254700111222",
      email: "jane@example.com",
      county: "Nairobi",
      town: "Westlands",
      address: "Apt 4B, Parklands",
      notes: "Please call before delivery",
      items: [
        { name: "Turkish Luxury Velvet", meters: 5, price: 950 }
      ],
      subtotal: 4750,
      status: "NEW"
    }
  });

  const order2 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-002" },
    update: {},
    create: {
      orderNumber: "ORD-2026-002",
      customerName: "David Client",
      phoneNumber: "254711333444",
      email: "david@example.com",
      county: "Mombasa",
      town: "Nyali",
      address: "Beach Road 12",
      items: [
        { name: "Premium Sheer Voile", meters: 10, price: 450 },
        { name: "Grey Blackout Max", meters: 10, price: 1200 }
      ],
      subtotal: 16500,
      status: "SHIPPED"
    }
  });

  // Seed Custom Requests
  const req1 = await prisma.customRequest.create({
    data: {
      customerName: "Sarah Connor",
      phoneNumber: "0712345678",
      email: "sarah@example.com",
      windowWidth: 3.5,
      windowHeight: 2.5,
      roomType: "Living Room",
      photos: [],
      notes: "I have 3 very wide windows. I need blackout curtains.",
      status: "New"
    }
  });

  const req2 = await prisma.customRequest.create({
    data: {
      customerName: "Michael Smith",
      phoneNumber: "0723456789",
      email: "michael@example.com",
      windowWidth: 10,
      windowHeight: 3,
      roomType: "Entire House",
      photos: [],
      notes: "Looking for a bulk discount for my 4 bedroom house.",
      status: "Quoted"
    }
  });

  console.log("✅ Seeded Orders and Requests successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
