import { prisma } from "../config/db.js";

export const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({ where: { username } });
};

export const createUser = async (username, hashedPassword) => {
  return await prisma.user.create({
    data: { username, password: hashedPassword }
  });
};

