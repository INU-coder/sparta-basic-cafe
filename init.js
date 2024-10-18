import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const menuData = [
    {
      name: '아메리카노',
      type: 'Coffee',
      temperature: 'HOT',
      price: 4.5,
    },
    {
      name: '카푸치노',
      type: 'Coffee',
      temperature: 'HOT',
      price: 5.0,
    },
    {
      name: '모히또',
      type: 'Cocktail',
      temperature: 'ICE',
      price: 6.0,
    },
    {
      name: '아침햇살',
      type: 'Drink',
      temperature: 'ICE',
      price: 2.5,
    },
  ];

  const newMenus = await prisma.menu.createMany({
    data: menuData,
  });

  console.log(`${newMenus.count}개의 메뉴가 추가되었습니다.`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
