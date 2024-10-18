import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.menu.createMany({
    data: [
      {
        name: 'Latte',
        type: 'Coffee',
        temperature: 'hot',
        price: 4500,
        totalOrders: 5,
      },
      {
        name: 'Iced Tea',
        type: 'Tea',
        temperature: 'ice',
        price: 3000,
        totalOrders: 10,
      },
      {
        name: 'Cappuccino',
        type: 'Coffee',
        temperature: 'hot',
        price: 5000,
        totalOrders: 3,
      },
    ],
  });

  console.log('후헤헿');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
