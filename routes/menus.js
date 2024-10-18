import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// 메뉴 수, 주문 수, 총 매출과 관련된 통계를 반환합니다.
router.get('/stats', async (req, res) => {
  try {
    const totalMenus = await prisma.menu.count(); // 메뉴 수 세기
    const totalOrders = await prisma.orderHistory.count(); // 주문 수 세기

    // 모든 주문 내역 가져오기
    const orders = await prisma.orderHistory.findMany({
      select: {
        menu: {
          select: {
            price: true,
          },
        },
      },
    });

    let totalSales = 0;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      totalSales += order.menu.price; // 메뉴 가격 더하기
    }

    res.status(200).json({
      stats: {
        totalMenus: totalMenus,
        totalOrders: totalOrders,
        totalSales: totalSales,
      },
    });
  } catch (error) {
    res.status(500).json({ error: '서버 에러' });
  }
});

router.get('/', async (req, res) => {
  try {
    const menus = await prisma.menu.findMany();
    const menuList = [];
    for (let i = 0; i < menus.length; i++) {
      const totalOrders = await prisma.orderHistory.count({
        where: { menu_id: menus[i].id },
      });
      // 메뉴 객체 만들기
      const menu = {
        id: menus[i].id,
        name: menus[i].name,
        type: menus[i].type,
        temperature: menus[i].temperature,
        price: menus[i].price,
        totalOrders: totalOrders,
      };
      // 메뉴 리스트에 추가
      menuList.push(menu);
    }
    // 메뉴 리스트 반환
    res.status(200).json({ menus: menuList });
  } catch (error) {
    res.status(500).json({ error: '서버 에러' });
  }
});
router.get('/:menuId', async (req, res, next) => {
  const id = parseInt(req.params.menuId);
  try {
    const menu = await prisma.menu.findUnique({ where: { id: id } });
    if (menu) {
      res.status(200).json(menu);
    } else {
      res.status(400).json({ message: '메뉴가 없수다' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//생성을 해야한다
router.post('/', async (req, res) => {
  const { name, type, temperature, price } = req.body;
  console.log(req.body); // 요청 데이터 확인
  if (!name || !type || !temperature || isNaN(price)) {
    return res.status(400).json({ error: '그 잘 좀 생성해주쇼.' });
  }
  try {
    const 신메뉴 = await prisma.menu.create({
      data: { name, type, temperature, price: parseFloat(price) },
    });
    console.log('생성된 메뉴:', 신메뉴);
    res.status(201).json({
      message: `오늘은 내가 ${신메뉴} 요리사.`,
      menu: 신메뉴,
    });
  } catch (error) {
    console.log('에러 발생:', error.message); // 에러 메시지 확인
    res.status(500).json({ error: `${신메뉴}가 even하게 익지 않았아요.` });
  }
});
//이건수정
router.put('/:menuId', async (req, res) => {
  const id = parseInt(req.params.menuId);
  if (isNaN(id)) {
    return res.status(400).json({ error: '이건 좀 아닌 것 같습니다.' });
  }
  const { name, type, temperature, price } = req.body;
  if (!name || !type || !temperature || isNaN(price)) {
    return res.status(400).json({ error: 'errorrrrrrrrrrrr' });
  }
  try {
    const 메뉴수정 = await prisma.menu.update({
      where: { id: id },
      data: { name, type, temperature, price: parseFloat(price) },
    });
    console.log('수정된 메뉴:', 메뉴수정);
    res.status(200).json({
      message: '성★공.',
      menu: 메뉴수정,
    });
  } catch (error) {
    console.log('에러 발생:', error.message);
    res.status(500).json({ error: '실☆패.' });
  }
});
//이건삭제
router.delete('/:menuId', async (req, res) => {
  const id = parseInt(req.params.menuId);
  if (isNaN(id)) {
    return res.status(400).json({ error: '흐음....' });
  }
  try {
    await prisma.menu.delete({
      where: { id: id },
    });
    res.status(200).json({
      message: `메뉴 ${id}이 삭제되었습니다.`,
    });
  } catch (error) {
    console.log('에러 발생:', error.message);
    res.status(500).json({ error: '메뉴 삭제 실패.' });
  }
});

export default router;
