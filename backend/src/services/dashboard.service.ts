import prisma from '../utils/prisma';

export const getDashboardStats = async (storeId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalSalesToday,
    totalExpensesToday,
    lowStockProducts,
    recentSales,
  ] = await Promise.all([
    // Total Sales Today
    prisma.sale.aggregate({
      where: {
        storeId,
        createdAt: { gte: today },
      },
      _sum: { totalAmount: true },
    }),

    // Total Expenses Today
    prisma.expense.aggregate({
      where: {
        storeId,
        date: { gte: today },
      },
      _sum: { amount: true },
    }),

    // Low Stock Products (e.g., < 10)
    prisma.product.count({
      where: {
        storeId,
        stockQuantity: { lt: 10 },
      },
    }),

    // Recent Sales
    prisma.sale.findMany({
      where: { storeId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
  ]);

  return {
    salesToday: totalSalesToday._sum.totalAmount || 0,
    expensesToday: totalExpensesToday._sum.amount || 0,
    lowStockCount: lowStockProducts,
    recentSales,
  };
};
