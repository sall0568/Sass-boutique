import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { MovementType } from '@prisma/client';

export const createStockMovement = async (data: {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  storeId: string;
}) => {
  const product = await prisma.product.findFirst({
    where: { id: data.productId, storeId: data.storeId },
  });

  if (!product) {
    throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  }

  return prisma.$transaction(async (tx) => {
    // Create movement record
    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
      },
    });

    // Update product stock
    let newQuantity = product.stockQuantity;
    if (data.type === MovementType.IN) {
      newQuantity += data.quantity;
    } else if (data.type === MovementType.OUT) {
      newQuantity -= data.quantity;
    } else if (data.type === MovementType.ADJUSTMENT) {
      // For adjustment, we might need to know if it's adding or removing, 
      // or if the quantity passed is the NEW total. 
      // Assuming here that adjustment is a delta. 
      // If positive, add. If negative (not allowed by schema positive()), remove?
      // Actually, usually adjustment implies setting to a value or adding/removing.
      // Let's assume for this simple logic: 
      // If the user wants to set stock, they should calculate the difference.
      // Or we can treat adjustment as "add" (if +) or "remove" (if -).
      // But schema says positive.
      // Let's assume IN/OUT are the main ones. Adjustment might be used for corrections.
      // Let's treat Adjustment as "Set to" or just "Add/Sub". 
      // For simplicity, let's say Adjustment adds (if you want to remove, use OUT).
      // Wait, usually Adjustment can be negative.
      // Let's keep it simple: IN adds, OUT removes.
      // If type is adjustment, let's assume it's just logging a change, but we need to know direction.
      // Let's assume the quantity is always positive, and we need another field or just use IN/OUT.
      // But if I want to "Correct" stock from 10 to 12, I add 2 (IN).
      // If I want to "Correct" from 10 to 8, I remove 2 (OUT).
      // So ADJUSMENT might just be a label for the reason.
      // Let's apply the same logic: IN adds, OUT removes. 
      // If type is ADJUSTMENT, we need to know if it's + or -.
      // Let's assume for now we only support IN/OUT for updating stock, 
      // and ADJUSTMENT is a special type that acts like IN or OUT depending on context?
      // No, let's just say:
      // IN: +
      // OUT: -
      // ADJUSTMENT: + (if you want to reduce, use OUT with reason "Adjustment")
      // Actually, let's just stick to IN adds, OUT subtracts.
      if (data.type === MovementType.ADJUSTMENT) {
         // This is ambiguous. Let's assume it acts like IN for now or maybe we shouldn't use it for calculation without more info.
         // Let's just treat it as IN for now, or maybe we should change schema to allow negative?
         // Schema says quantity is Int.
         // Let's just use IN/OUT for updates.
         newQuantity += data.quantity; 
      }
    }

    if (newQuantity < 0) {
      throw new AppError('Insufficient stock', StatusCodes.BAD_REQUEST);
    }

    await tx.product.update({
      where: { id: data.productId },
      data: { stockQuantity: newQuantity },
    });

    return movement;
  });
};

export const getStockMovements = async (storeId: string) => {
  return prisma.stockMovement.findMany({
    where: {
      product: {
        storeId: storeId,
      },
    },
    include: {
      product: {
        select: { name: true, sku: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
