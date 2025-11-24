import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { MovementType } from '@prisma/client';

export const createSale = async (
  userId: string,
  storeId: string,
  items: { productId: string; quantity: number }[]
) => {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const saleItemsData = [];

    for (const item of items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, storeId },
      });

      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, StatusCodes.NOT_FOUND);
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          `Insufficient stock for product ${product.name}`,
          StatusCodes.BAD_REQUEST
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      saleItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      });

      // Deduct stock
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: product.stockQuantity - item.quantity },
      });

      // Create stock movement record
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          type: MovementType.OUT,
          quantity: item.quantity,
          reason: 'Sale',
        },
      });
    }

    const sale = await tx.sale.create({
      data: {
        userId,
        storeId,
        totalAmount,
        items: {
          create: saleItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return sale;
  });
};

export const getSales = async (storeId: string) => {
  return prisma.sale.findMany({
    where: { storeId },
    include: {
      user: { select: { name: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSaleById = async (id: string, storeId: string) => {
  const sale = await prisma.sale.findFirst({
    where: { id, storeId },
    include: {
      user: { select: { name: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
  });

  if (!sale) {
    throw new AppError('Sale not found', StatusCodes.NOT_FOUND);
  }

  return sale;
};
