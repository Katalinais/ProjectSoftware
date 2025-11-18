import { prisma } from "../config/db.js";

export const findPersonById = async (id) => {
  return await prisma.person.findUnique({ where: { id } });
};

export const findPersonByDocument = async (document) => {
  return await prisma.person.findUnique({ where: { document } });
};

export const createPerson = async (name, documentType, document) => {
  return await prisma.person.create({
    data: { name, documentType, document }
  });
};

export const updatePerson = async (id, name, documentType, document) => {
  return await prisma.person.update({
    where: { id },
    data: { name, documentType, document }
  });
};

export const findAllPeople = async () => {
  return await prisma.person.findMany({
    orderBy: { name: "asc" }
  });
};

export const searchPeople = async (searchTerm) => {
  const trimmedSearchTerm = searchTerm.trim();
  return await prisma.person.findMany({
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
};

