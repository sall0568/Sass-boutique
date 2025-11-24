import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';

export const createCategory = async (data: { name: string; storeId: string }) => {
  return prisma.category.create({
    data,
  });
};

export const getCategories = async (storeId: string) => {
  return prisma.category.findMany({
    where: { storeId },
    include: { _count: { select: { products: true } } },
  });
};

export const getCategoryById = async (id: string, storeId: string) => {
  const category = await prisma.category.findFirst({
    where: { id, storeId },
  });

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return category;
};

export const updateCategory = async (
  id: string,
  storeId: string,
  data: { name?: string }
) => {
  const category = await prisma.category.findFirst({
    where: { id, storeId },
  });

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string, storeId: string) => {
  const category = await prisma.category.findFirst({
    where: { id, storeId },
  });

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return prisma.category.delete({
    where: { id },
  });
};
