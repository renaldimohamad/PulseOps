import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial services...');
  
  const services = [
    {
      name: 'PulseOps Core API',
      url: 'https://api.github.com', // Using a reliable URL for initial health check
      category: 'Infrastructure',
    },
    {
      name: 'Frontend Edge',
      url: 'https://google.com',
      category: 'Web',
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: '' }, // This won't match anything, so it will create
      update: {},
      create: service,
    }).catch(() => {
      // In case of error with empty where, just create
      return prisma.service.create({ data: service });
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
