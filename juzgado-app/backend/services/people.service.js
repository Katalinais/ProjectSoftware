import { prisma } from "../config/db.js";

export const addPersonService = async (name, documentType, document) => {
  const existing = await prisma.person.findUnique({ where: { document } });
  if (existing) {
    throw new Error("La persona ya está registrada");
  }

  await prisma.person.create({
    data: { name, documentType, document }
  });

  return { message: "Persona creada correctamente ✅" };
};

export const editPersonService = async (id, name, documentType, document) => {
  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) {
    throw new Error("La persona no existe");
  }

  // Si el documento cambió, verificar que no exista otro con ese documento
  if (document !== person.document) {
    const existing = await prisma.person.findUnique({ where: { document } });
    if (existing) {
      throw new Error("Ya existe una persona con ese número de documento");
    }
  }

  await prisma.person.update({
    where: { id },
    data: { name, documentType, document }
  });

  return { message: "Persona actualizada correctamente ✅" };
};

export const searchPeopleService = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") {
    const people = await prisma.person.findMany({
      orderBy: { name: "asc" }
    });
    return { people, count: people.length };
  }

  const trimmedSearchTerm = searchTerm.trim();

  const people = await prisma.person.findMany({
    where: {
      OR: [
        {
          name: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        },
        {
          document: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        },
        {
          documentType: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        }
      ]
    },
    orderBy: { name: "asc" }
  });

  return { people, count: people.length };
};