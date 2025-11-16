import { prisma } from "../config/db.js";
import { Status } from "@prisma/client";

export const updateTrialStatusService = async (trialId, status, closeDate) => {
  const validStatuses = Object.values(Status);
  if (!validStatuses.includes(status)) {
    throw new Error(`Estado inválido. Los estados válidos son: ${validStatuses.join(", ")}`);
  }

  const trial = await prisma.trial.findUnique({ where: { id: trialId } });
  if (!trial) {
    throw new Error("El proceso no existe");
  }

  const updateData = { status };
  
  if (status === Status.ARCHIVADO || status === "ARCHIVADO") {
    updateData.closeDate = closeDate ? new Date(closeDate) : new Date();
  }

  await prisma.trial.update({
    where: { id: trialId },
    data: updateData
  });

  return { message: "Estado del proceso actualizado correctamente" };
};

export const addTrialService = async (id, number, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId) => {
  const existing = await prisma.trial.findUnique({ where: { id } });
  if (existing) {
    throw new Error("El proceso ya está registrado");
  }

  const typeTrial = await prisma.typeTrial.findUnique({
    where: { id: typeTrialId }
  });

  if (!typeTrial) {
    throw new Error("El tipo de proceso no existe");
  }

  // Validar que "pago por consignación" no tenga categoría
  const typeTrialName = typeTrial.name.toLowerCase()
  console.log(typeTrialName);
  if (typeTrialName === "pagos por consignación" || typeTrialName === "pagos por consignacion") {
    if (categoryId) {
      throw new Error("El tipo de proceso 'Pago por consignación' no debe tener categoría");
    }
  } else {
    // Para otros tipos, validar que tengan categoría
    if (!categoryId) {
      throw new Error("La categoría es requerida para este tipo de proceso");
    }
  }

  if (typeTrial.name === "Incidente de desacato" || typeTrial.name.toLowerCase() === "incidente de desacato") {
    const tutelaType = await prisma.typeTrial.findFirst({
      where: {
        name: {
          equals: "Tutela",
          mode: "insensitive"
        }
      }
    });

    if (!tutelaType) {
      throw new Error("No se encontró el tipo de proceso 'Tutela' en el sistema");
    }

    const existingTutela = await prisma.trial.findFirst({
      where: {
        number: number,
        typeTrialId: tutelaType.id
      }
    });

    if (!existingTutela) {
      throw new Error("No se puede crear un Incidente de desacato sin una Tutela previa con el mismo número de proceso");
    }
  }

  await prisma.trial.create({
    data: { id, number, typeTrialId, categoryId: categoryId || null, plaintiffId, defendantId, arrivalDate, closeDate,status, entryTypeId }
  });
  return { message: "Proceso creado correctamente" };
};

export const editTrialService = async (id, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId) => {
  const trial = await prisma.trial.findUnique({ where: { id } });
  if (!trial) {
    throw new Error("Proceso no encontrado");
  }

  const typeTrial = await prisma.typeTrial.findUnique({
    where: { id: typeTrialId }
  });

  if (!typeTrial) {
    throw new Error("El tipo de proceso no existe");
  }

  // Validar que "pago por consignación" no tenga categoría
  const typeTrialName = typeTrial.name.toLowerCase();
  if (typeTrialName === "pagos por consignación" || typeTrialName === "pagos por consignacion") {
    if (categoryId) {
      throw new Error("El tipo de proceso 'Pago por consignación' no debe tener categoría");
    }
  } else {
    // Para otros tipos, validar que tengan categoría
    if (!categoryId) {
      throw new Error("La categoría es requerida para este tipo de proceso");
    }
  }
  
  await prisma.trial.update({
    where: { id },
    data: { typeTrialId, categoryId: categoryId || null, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId }
  });

  return { message: "Proceso actualizado correctamente" };
};

export const searchTrialsService = async (searchTerm, filterType) => {
  const whereClause = {};

  if (searchTerm && searchTerm.trim() !== "") {
    const trimmedSearchTerm = searchTerm.trim();
    whereClause.OR = [
      {
        number: {
          contains: trimmedSearchTerm,
          mode: "insensitive"
        }
      },
      {
        plaintiff: {
          name: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        }
      },
      {
        defendant: {
          name: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        }
      },
      {
        category: {
          description: {
            contains: trimmedSearchTerm,
            mode: "insensitive"
          }
        }
      }
    ];
  }

  if (filterType && filterType.trim() !== "") {
    const typeMapping = {
      "Tutela": "Tutela",
      "Ordinario": "Laboral",
      "Habeas corpus": "Habeas corpus",
      "Incidente de desacato": "Incidente de desacato"
    };
    
    const dbTypeName = typeMapping[filterType] || filterType;

    const typeTrial = await prisma.typeTrial.findFirst({
      where: { name: dbTypeName }
    });
    
    if (typeTrial) {
      whereClause.typeTrialId = typeTrial.id;
    }
  }

  const trials = await prisma.trial.findMany({
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
      }
    },
    orderBy: { arrivalDate: "desc" }
  });

  return { trials, count: trials.length };
};

export const getCategoriesByTrialTypeService = async (trialTypeName) => {
  try {
    const typeMapping = {
      "Tutela": "Tutela",
      "Ordinario": "Laboral", 
      "Habeas corpus": "Habeas corpus",
      "Incidente de desacato": "Tutela",
      "Laboral": "Laboral"
    };

    let dbTypeName = typeMapping[trialTypeName];
    
    if (!dbTypeName) {
      dbTypeName = trialTypeName;
    }
    
    console.log(`Buscando categorías para tipo: ${trialTypeName} -> ${dbTypeName}`);
    const typeTrial = await prisma.typeTrial.findFirst({
      where: {
        name: {
          equals: dbTypeName,
          mode: "insensitive"
        }
      }
    });

    if (!typeTrial) {
      console.log(`No se encontró TypeTrial con nombre: ${dbTypeName}`);
      const allTypes = await prisma.typeTrial.findMany();
      console.log("TypeTrial disponibles:", allTypes.map(t => t.name));
      return { categories: [], count: 0 };
    }

    console.log(`TypeTrial encontrado: ${typeTrial.id} - ${typeTrial.name}`);
    const categories = await prisma.category.findMany({
      where: {
        typeTrialId: typeTrial.id
      },
      orderBy: {
        description: "asc"
      }
    });

    console.log(`Categorías encontradas: ${categories.length}`);
    return { categories, count: categories.length };
  } catch (error) {
    console.error("Error en getCategoriesByTrialTypeService:", error);
    throw error;
  }
};

export const getAllTrialTypesService = async () => {
  try {
    const types = await prisma.typeTrial.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return { types, count: types.length };
  } catch (error) {
    console.error("Error en getAllTrialTypesService:", error);
    throw error;
  }
};

export const getAllEntryTypesService = async () => {
  try {
    const entryTypes = await prisma.entryType.findMany({
      orderBy: {
        description: "asc"
      }
    });

    return { entryTypes, count: entryTypes.length };
  } catch (error) {
    console.error("Error en getAllEntryTypesService:", error);
    throw error;
  }
};