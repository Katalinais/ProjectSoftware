import { prisma } from "../config/db.js";
import { Status } from "@prisma/client";

// Operaciones para Trial
export const findTrialById = async (id) => {
  return await prisma.trial.findUnique({ where: { id } });
};

export const findTrialByNumberAndType = async (number, typeTrialId) => {
  return await prisma.trial.findFirst({
    where: {
      number: number,
      typeTrialId: typeTrialId
    }
  });
};

export const createTrial = async (id, number, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId) => {
  return await prisma.trial.create({
    data: { id, number, typeTrialId, categoryId: categoryId || null, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId }
  });
};

export const updateTrial = async (id, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId) => {
  return await prisma.trial.update({
    where: { id },
    data: { typeTrialId, categoryId: categoryId || null, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId }
  });
};

export const updateTrialStatus = async (id, status, closeDate) => {
  const updateData = { status };
  
  if (status === "ARCHIVADO" || status === Status.ARCHIVADO) {
    updateData.closeDate = closeDate ? new Date(closeDate) : new Date();
  }
  
  return await prisma.trial.update({
    where: { id },
    data: updateData
  });
};

export const searchTrials = async (whereClause) => {
  return await prisma.trial.findMany({
    where: whereClause,
    include: {
      typeTrial: {
        select: {
          id: true,
          name: true
        }
      },
      category: {
        select: {
          id: true,
          description: true
        }
      },
      entryType: {
        select: {
          id: true,
          description: true
        }
      },
      plaintiff: {
        select: {
          id: true,
          name: true,
          document: true
        }
      },
      defendant: {
        select: {
          id: true,
          name: true,
          document: true
        }
      },
      actions: {
        include: {
          descriptionAction: {
            include: {
              typeAction: {
                select: {
                  id: true,
                  description: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { arrivalDate: "desc" }
  });
};

// Operaciones para TypeTrial
export const findTypeTrialById = async (id) => {
  return await prisma.typeTrial.findUnique({ where: { id } });
};

export const findTypeTrialByName = async (name, caseSensitive = false) => {
  if (caseSensitive) {
    return await prisma.typeTrial.findFirst({
      where: { name: name }
    });
  }
  return await prisma.typeTrial.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive"
      }
    }
  });
};

export const findAllTypeTrials = async () => {
  return await prisma.typeTrial.findMany({
    orderBy: {
      name: "asc"
    }
  });
};

// Operaciones para Category
export const findCategoriesByTypeTrialId = async (typeTrialId) => {
  return await prisma.category.findMany({
    where: {
      typeTrialId: typeTrialId
    },
    orderBy: {
      description: "asc"
    }
  });
};

// Operaciones para EntryType
export const findAllEntryTypes = async () => {
  return await prisma.entryType.findMany({
    orderBy: {
      description: "asc"
    }
  });
};

