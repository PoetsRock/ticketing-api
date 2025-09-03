import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCustomers(): Promise<void> {
  const now = new Date();
  const customers = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      createdAt: now,
      modifiedAt: now,
      seatsOnHold: [],
      seatsReserved: [],
    },
    {
      id: '450e8400-e29b-41d4-a716-446655440002',
      createdAt: now,
      modifiedAt: now,
      seatsOnHold: [],
      seatsReserved: [],
    },
  ];

  let count = 0;
  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: customer,
    });
    count++;
    console.log(`seeding customer #${count}:\n`, customer);
  }

  console.log('Customers seeded successfully');
}

async function main(): Promise<void> {
  await seedCustomers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
