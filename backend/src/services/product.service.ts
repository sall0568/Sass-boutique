import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';

export const createProduct = async (data: any) => {
  return prisma.product.create({
    data,
  });
};

export const getProducts = async (storeId: string) => {
  return prisma.product.findMany({
    where: { storeId },
    include: { category: true },
  });
};

export const getProductById = async (id: string, storeId: string) => {
  const product = await prisma.product.findFirst({
    where: { id, storeId },
    include: { category: true },
  });

  if (!product) {
    throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  }

  return product;
};

export const updateProduct = async (
  id: string,
  storeId: string,
  data: any
) => {
  const product = await prisma.product.findFirst({
    where: { id, storeId },
  });

  if (!product) {
    throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  }

  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string, storeId: string) => {
  const product = await prisma.product.findFirst({
    where: { id, storeId },
  });

  if (!product) {
    throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  }

  return prisma.product.delete({
    where: { id },
  });
};
