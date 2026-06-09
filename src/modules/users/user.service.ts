import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import { PaginationMap, UpdateUser, User } from "./user.types";

export async function createUser(input: User) {
  try {
    return await prisma.user.create({
      data: input,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Email already exists");
    }

    throw error;
  }
}

export async function getAllUsers(input: PaginationMap) {
  const where: Prisma.UserWhereInput = {};

  where.deletedAt = null;
  if (input.role) {
    where.role = input.role;
  }

  const q = input.q?.trim();

  if (q) {
    where.OR = [{ name: { contains: q } }, { email: { contains: q } }];
  }

  const allUsers = await prisma.user.findMany({
    where,
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: {
      [input.sortBy]: input.sortOrder,
    },
  });

  const count = await prisma.user.count({ where });
  return {
    data: allUsers,
    meta: {
      ...input,
      total: count,
      totalPages: Math.ceil(count / (input.limit || 1)),
    },
  };
}

export async function getUserById(id: string) {
  const userId = Number(id);

  if (isNaN(userId)) throw new AppError(400, "Invalid user id");
  const foundUser = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!foundUser) throw new AppError(404, "User not found");
  return foundUser;
}

export async function updateUser(id: string, input: UpdateUser) {
  const userId = Number(id);

  if (isNaN(userId)) throw new AppError(400, "Invalid user id");

  try {
    const foundUser = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!foundUser) throw new AppError(404, "User not found");

    return await prisma.user.update({
      where: { id: userId },
      data: input,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError(404, "User not found");
    }

    throw error;
  }
}

export async function deleteUser(id: string) {
  const userId = Number(id);

  if (isNaN(userId)) throw new AppError(400, "Invalid user id");

  try {
    const existingUser = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!existingUser) throw new AppError(404, "User not found");

    return await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError(404, "User not found");
    }

    throw error;
  }
}
