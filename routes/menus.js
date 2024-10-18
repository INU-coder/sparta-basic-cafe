import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// 메뉴 수, 주문 수, 총 매출과 관련된 통계를 반환합니다.
router.get('/menus', async (req, res) => {
  try {
    // 메뉴 count
    const totalMenus = await prisma.menu.count();
    // console.log('총 메뉴 수:', totalMenus); // 중간 점검
    // 주문 count
    const totalOrders = await prisma.orderHistory.count();
    // console.log('총 주문 수:', totalOrders); // 중간 점검
    // prisma에있는 orderHistory에서 findMany하기
    const orders = await prisma.orderHistory.findMany();
    // console.log('주문 내역:', orders); // 중간 점검
    let totalSales = 0;
    // 주문 데이터를 순회하면서 매출 계산
    for (let i = 0; i < orders.length; i++) {
      // console.log(`현재 ${i + 1}번째 주문 처리 중`); // 중간 점검
      const order = await prisma.menu.findUnique({
        where: { id: orders[i].menu_id },
        select: { price: true },
      });
      // console.log('메뉴 가격:', order.price); // 중간 점검
      totalSales += order.price;
      // console.log('현재까지 총 매출:', totalSales); // 중간 점검
    }
    res.status(200).json({
      stats: {
        totalMenus: totalMenus,
        totalOrders: totalOrders,
        totalSales: totalSales,
      },
    });
  } catch (error) {
    // console.error('에러 발생:', error);
    res.status(500).json({ error: '멈춰! 야메로!' });
  }
});

// 사용 가능한 메뉴 목록을 반환합니다.
// 근데 이제 totalOrders를 곁드린.
// totalOrders 는 해당 메뉴의 총 주문 수를 나타냅니다.
// 이 값을 제외하고 기능을 개발하고 마지막으로 totalOrders 를 추가하세요.
router.get('/', async (req, res) => {
  try {
    // 모든 메뉴 가져오기
    const menus = await prisma.menu.findMany();
    // console.log('메뉴 목록:', menus); // 중간 점검
    const menuList = [];

    // if (각 메뉴에 대해 주문 수 계산) {메뉴 리스트에 추가};
    for (let i = 0; i < menus.length; i++) {
      // console.log(`현재 ${i + 1}번째 메뉴 처리 중`); // 중간 점검

      const totalOrders = await prisma.orderHistory.count({
        where: { menu_id: menus[i].id },
      });
      // console.log('주문 수:', totalOrders); // 중간 점검

      // 메뉴 객체 만들기
      const menu = {
        id: menus[i].id,
        name: menus[i].name,
        type: menus[i].type,
        temperature: menus[i].temperature,
        price: menus[i].price,
        totalOrders: totalOrders,
      };
      // console.log('메뉴 정보:', menu); // 중간 점검
      // 메뉴 리스트에 추가
      menuList.push(menu);
      // console.log('현재까지 메뉴 리스트:', menuList); // 중간 점검
    }
    // 메뉴 리스트 반환
    res.status(200).json({ menus: menuList });
  } catch (error) {
    // console.error('에러 발생:', error); // 에러 로그
    res.status(500).json({ error: '서버 에러' });
  }
});

//결론 for문은 만능이고 짱짱인데 왜 다들 이상한코드를 쓰는걸까.
//그 답을 난 알고있다는 사실을 알고있다.
//cpu?가 과부?되는 원인? 같은 느낌으로
//아에 특정한 코드를 사용함으로써
//뭐랄까 연산을 더 빠르게 하기위해 많은 코드들을 알고있는게 좋을 것 같다.
// 예를 들어 지금은 단순한 데이터하나조회하고 끝이지만
// 연산을 for문으로 돌아서 연산한 걸, for문으로 도는 느낌으로다가 거쳐서 연산해야되는게 많아지고,
// 그걸 1000명쯤이 동시에하면
// 컴퓨터가 신기해질지도 모르겠다.
// 뭐했다고 새벽 4시일까 진짜 버그인듯하다
// 끝.
export default router;
