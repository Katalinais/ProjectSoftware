import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerAdminService = async (username, password) => {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { username, password: hashedPassword }
  });

  return { message: "Usuario admin creado correctamente ✅" };
};

export const loginAdminService = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "2h"
  });

  return { message: "Login exitoso ✅", token };
};