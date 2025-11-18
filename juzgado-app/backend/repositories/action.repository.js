import { prisma } from "../config/db.js";

export const findActionById = async (id) => {
  return await prisma.action.findUnique({ where: { id } });
};

export const createAction = async (id, descriptionActionId, date, trialId) => {
  return await prisma.action.create({
    data: { id, descriptionActionId, date, trialId }
  });
};

export const updateAction = async (id, descriptionActionId, date, trialId) => {
  return await prisma.action.update({
    where: { id },
    data: { descriptionActionId, date, trialId }
  });
};

export const deleteAction = async (id) => {
  return await prisma.action.delete({
    where: { id }
  });
};

export const findActionsByTrialId = async (trialId) => {
  return await prisma.action.findMany({
    where: {
      trialId: trialId
    },
    include: {
      descriptionAction: {
        select: {
          id: true,
          description: true,
          typeAction: {
            select: {
              id: true,
              description: true
            }
          }
        }
      }
    },
    orderBy: {
      date: "desc"
    }
  });
};

export const searchActions = async (whereClause) => {
  return await prisma.action.findMany({
    where: whereClause,
    include: {
      descriptionAction: {
        select: {
          id: true,
          description: true,
          typeAction: {
            select: {
              id: true,
              description: true
            }
          }
        }
      },
      trial: {
        select: {
          id: true,
          number: true,
          typeTrial: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      date: "desc"
    }
  });
};

export const countActionsByDescriptionActionId = async (descriptionActionId) => {
  return await prisma.action.count({
    where: { descriptionActionId }
  });
};

export const findDescriptionActionById = async (id) => {
  return await prisma.descriptionAction.findUnique({ where: { id } });
};

export const findDescriptionActionByFields = async (description, typeActionId, typeTrialId, excludeId = null) => {
  const where = {
    description: description.trim(),
    typeActionId: typeActionId,
    typeTrialId: typeTrialId || null
  };
  
  if (excludeId) {
    where.id = { not: excludeId };
  }
  
  return await prisma.descriptionAction.findFirst({ where });
};

export const createDescriptionAction = async (description, typeActionId, typeTrialId) => {
  return await prisma.descriptionAction.create({
    data: {
      description: description.trim(),
      typeActionId: typeActionId,
      typeTrialId: typeTrialId || null
    },
    include: {
      typeAction: {
        select: {
          id: true,
          description: true
        }
      },
      typeTrial: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const updateDescriptionAction = async (id, description, typeActionId, typeTrialId) => {
  return await prisma.descriptionAction.update({
    where: { id },
    data: {
      description: description.trim(),
      typeActionId: typeActionId,
      typeTrialId: typeTrialId || null
    },
    include: {
      typeAction: {
        select: {
          id: true,
          description: true
        }
      },
      typeTrial: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const deleteDescriptionAction = async (id) => {
  return await prisma.descriptionAction.delete({
    where: { id }
  });
};

export const findDescriptionActions = async (whereClause) => {
  return await prisma.descriptionAction.findMany({
    where: whereClause,
    include: {
      typeAction: {
        select: {
          id: true,
          description: true
        }
      },
      typeTrial: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      description: "asc"
    }
  });
};

export const findAllTypeActions = async () => {
  return await prisma.typeAction.findMany({
    orderBy: {
      description: "asc"
    }
  });
};

export const findTypeActionById = async (id) => {
  return await prisma.typeAction.findUnique({ where: { id } });
};

