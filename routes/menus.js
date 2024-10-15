import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
router.get('/stats', async (req, res, next) => {
  const menus = prisma.menu.findMany();
  const orders = prisma.order.findMany();

  res.status(200).json({
    stats: {
      totalMenus: 3,
      totalOrders: 10,
      totalSales: 30000,
    },
  });
});

router.get('/', (req, res, next) => {
  res.status(200).json({
    menus: [
      {
        id: 1,
        name: 'Latte',
        type: 'Coffee',
        temperature: 'hot',
        price: 4500,
        totalOrders: 5,
      },
      {
        id: 2,
        name: 'Iced Tea',
        type: 'Tea',
        temperature: 'ice',
        price: 3000,
        totalOrders: 10,
      },
    ],
  });
});

export default router;
