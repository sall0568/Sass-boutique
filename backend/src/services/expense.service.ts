import prisma from '../utils/prisma';

export const createExpense = async (
  userId: string,
  storeId: string,
  data: { description: string; amount: number; date?: string }
) => {
  return prisma.expense.create({
    data: {
      description: data.description,
      amount: data.amount,
      date: data.date ? new Date(data.date) : new Date(),
      userId,
      storeId,
    },
  });
};

export const getExpenses = async (storeId: string) => {
  return prisma.expense.findMany({
    where: { storeId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
  });
};

export const deleteExpense = async (id: string, storeId: string) => {
  return prisma.expense.deleteMany({
    where: { id, storeId },
  });
};
