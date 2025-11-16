import { prisma } from "../config/db.js";
import { updateTrialStatusService } from "./trial.service.js";

export const addActionService  = async (id, descriptionActionId, date, trialId, status, closeDate) => {
    const existing = await prisma.action.findUnique({ where: { id } });
    if (existing) {
      throw new Error("La acción ya está registrada");
    }
  
    // Crear la acción
    await prisma.action.create({
      data: { id, descriptionActionId, date, trialId }
    });

    // Si se proporciona un estado y hay un trialId, actualizar el proceso
    if (status && trialId) {
      await updateTrialStatusService(trialId, status, closeDate);
    }

    return { message: "Acción creada correctamente" };
  };

  export const editActionService = async (id, descriptionActionId, date, trialId) => {
    const action = await prisma.action.findUnique({ where: { id } });
    if (!action) {
      throw new Error("La acción no existe");
    }
    await prisma.action.update({
      where: { id },
      data: { descriptionActionId, date, trialId }
    });
    return { message: "Acción actualizada correctamente" };
  };

export const searchActionsService = async (searchTerm, trialId) => {
  const whereClause = {};

  // Si hay un término de búsqueda, buscar en múltiples campos
  if (searchTerm && searchTerm.trim() !== "") {
    const trimmedSearchTerm = searchTerm.trim();
    whereClause.OR = [
      {
        descriptionAction: {
          description: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        }
      },
      {
        trial: {
          number: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        }
      }
    ];
  }

  // Si hay un trialId, filtrar por ese proceso
  if (trialId && trialId.trim() !== "") {
    whereClause.trialId = trialId;
  }

  const actions = await prisma.action.findMany({
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

  return { actions, count: actions.length };
};

export const deleteActionService = async (id) => {
  const action = await prisma.action.findUnique({ where: { id } });
  if (!action) {
    throw new Error("La acción no existe");
  }

  await prisma.action.delete({
    where: { id }
  });

  return { message: "Acción eliminada correctamente" };
};

export const getActionsByTrialService = async (trialId) => {
  const actions = await prisma.action.findMany({
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

  return { actions, count: actions.length };
};

export const getAllDescriptionActionsService = async (typeTrialId) => {
  try {
    const whereClause = {};
  
    if (typeTrialId) {
      // Obtener el tipo de proceso para verificar si es Ordinario o Ejecutivo
      const typeTrial = await prisma.typeTrial.findUnique({
        where: { id: typeTrialId },
        select: { id: true, name: true }
      });

      if (typeTrial) {
        const typeTrialName = typeTrial.name.toLowerCase();
        
        // Si es Ordinario o Ejecutivo, incluir descripciones de ambos tipos
        if (typeTrialName === "ordinario" || typeTrialName === "ejecutivo") {
          // Buscar ambos tipos de proceso
          const ordinarioType = await prisma.typeTrial.findFirst({
            where: { name: { equals: "Ordinario", mode: "insensitive" } },
            select: { id: true }
          });
          
          const ejecutivoType = await prisma.typeTrial.findFirst({
            where: { name: { equals: "Ejecutivo", mode: "insensitive" } },
            select: { id: true }
          });

          const typeTrialIds = [];
          if (ordinarioType) typeTrialIds.push(ordinarioType.id);
          if (ejecutivoType) typeTrialIds.push(ejecutivoType.id);

          whereClause.OR = [
            { typeTrialId: { in: typeTrialIds } },
            { typeTrialId: null }
          ];
        } else {
          // Para otros tipos, solo incluir ese tipo y las generales
          whereClause.OR = [
            { typeTrialId: typeTrialId },
            { typeTrialId: null }
          ];
        }
      } else {
        whereClause.OR = [
          { typeTrialId: null }
        ];
      }
    }
    
    const descriptionActions = await prisma.descriptionAction.findMany({
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

    return { descriptionActions, count: descriptionActions.length };
  } catch (error) {
    console.error("Error en getAllDescriptionActionsService:", error);
    throw error;
  }
};

export const getAllTypeActionsService = async () => {
  try {
    const typeActions = await prisma.typeAction.findMany({
      orderBy: {
        description: "asc"
      }
    });

    return { typeActions, count: typeActions.length };
  } catch (error) {
    console.error("Error en getAllTypeActionsService:", error);
    throw error;
  }
};

export const addDescriptionActionService = async (description, typeActionId, typeTrialId) => {
  const typeAction = await prisma.typeAction.findUnique({ 
    where: { id: typeActionId } 
  });
  if (!typeAction) {
    throw new Error("El tipo de acción no existe");
  }

  if (typeTrialId) {
    const typeTrial = await prisma.typeTrial.findUnique({ 
      where: { id: typeTrialId } 
    });
    if (!typeTrial) {
      throw new Error("El tipo de proceso no existe");
    }
  }

  const existing = await prisma.descriptionAction.findFirst({
    where: {
      description: description.trim(),
      typeActionId: typeActionId,
      typeTrialId: typeTrialId || null
    }
  });
  if (existing) {
    throw new Error("Ya existe una descripción con ese nombre para este tipo de acción y tipo de proceso");
  }

  const newDescriptionAction = await prisma.descriptionAction.create({
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

  return { 
    message: "Descripción de acción creada correctamente",
    descriptionAction: newDescriptionAction
  };
};

export const editDescriptionActionService = async (id, description, typeActionId, typeTrialId) => {
  const descriptionAction = await prisma.descriptionAction.findUnique({ where: { id } });
  if (!descriptionAction) {
    throw new Error("La descripción de acción no existe");
  }

  const typeAction = await prisma.typeAction.findUnique({ 
    where: { id: typeActionId } 
  });
  if (!typeAction) {
    throw new Error("El tipo de acción no existe");
  }

  if (typeTrialId) {
    const typeTrial = await prisma.typeTrial.findUnique({ 
      where: { id: typeTrialId } 
    });
    if (!typeTrial) {
      throw new Error("El tipo de proceso no existe");
    }
  }

  // Verificar si ya existe otra descripción igual para el mismo tipo de acción y tipo de proceso
  const existing = await prisma.descriptionAction.findFirst({
    where: {
      description: description.trim(),
      typeActionId: typeActionId,
      typeTrialId: typeTrialId || null,
      id: { not: id }
    }
  });
  if (existing) {
    throw new Error("Ya existe una descripción con ese nombre para este tipo de acción y tipo de proceso");
  }

  const updatedDescriptionAction = await prisma.descriptionAction.update({
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

  return { 
    message: "Descripción de acción actualizada correctamente",
    descriptionAction: updatedDescriptionAction
  };
};

export const deleteDescriptionActionService = async (id) => {
  const descriptionAction = await prisma.descriptionAction.findUnique({ where: { id } });
  if (!descriptionAction) {
    throw new Error("La descripción de acción no existe");
  }

  const actionsCount = await prisma.action.count({
    where: { descriptionActionId: id }
  });

  if (actionsCount > 0) {
    throw new Error("No se puede eliminar la descripción porque tiene acciones asociadas");
  }

  await prisma.descriptionAction.delete({
    where: { id }
  });

  return { message: "Descripción de acción eliminada correctamente" };
};