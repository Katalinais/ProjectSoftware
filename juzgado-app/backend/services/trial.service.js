import * as trialRepository from "../repositories/trial.repository.js";
import { Status } from "@prisma/client";

export const updateTrialStatusService = async (trialId, status, closeDate) => {
  const validStatuses = Object.values(Status);
  if (!validStatuses.includes(status)) {
    throw new Error(`Estado inválido. Los estados válidos son: ${validStatuses.join(", ")}`);
  }

  const trial = await trialRepository.findTrialById(trialId);
  if (!trial) {
    throw new Error("El proceso no existe");
  }

  await trialRepository.updateTrialStatus(trialId, status, closeDate);

  return { message: "Estado del proceso actualizado correctamente" };
};

export const addTrialService = async (id, number, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId) => {
  const existing = await trialRepository.findTrialById(id);
  if (existing) {
    throw new Error("El proceso ya está registrado");
  }

  const typeTrial = await trialRepository.findTypeTrialById(typeTrialId);

  if (!typeTrial) {
    throw new Error("El tipo de proceso no existe");
  }

  const typeTrialName = typeTrial.name.toLowerCase()
  console.log(typeTrialName);
  if (typeTrialName === "pagos por consignación" || typeTrialName === "pagos por consignacion") {
    if (categoryId) {
      throw new Error("El tipo de proceso 'Pago por consignación' no debe tener categoría");
    }
  } else {
    if (!categoryId) {
      throw new Error("La categoría es requerida para este tipo de proceso");
    }
  }

  if (typeTrial.name === "Incidente de desacato" || typeTrial.name.toLowerCase() === "incidente de desacato") {
    const tutelaType = await trialRepository.findTypeTrialByName("Tutela");

    if (!tutelaType) {
      throw new Error("No se encontró el tipo de proceso 'Tutela' en el sistema");
    }

    const existingTutela = await trialRepository.findTrialByNumberAndType(number, tutelaType.id);

    if (!existingTutela) {
      throw new Error("No se puede crear un Incidente de desacato sin una Tutela previa con el mismo número de proceso");
    }
  }

  await trialRepository.createTrial(id, number, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId);
  return { message: "Proceso creado correctamente" };
};

export const editTrialService = async (id, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId) => {
  const trial = await trialRepository.findTrialById(id);
  if (!trial) {
    throw new Error("Proceso no encontrado");
  }

  const typeTrial = await trialRepository.findTypeTrialById(typeTrialId);

  if (!typeTrial) {
    throw new Error("El tipo de proceso no existe");
  }

  const typeTrialName = typeTrial.name.toLowerCase();
  if (typeTrialName === "pagos por consignación" || typeTrialName === "pagos por consignacion") {
    if (categoryId) {
      throw new Error("El tipo de proceso 'Pago por consignación' no debe tener categoría");
    }
  } else {
    if (!categoryId) {
      throw new Error("La categoría es requerida para este tipo de proceso");
    }
  }
  
  await trialRepository.updateTrial(id, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId);

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

    const typeTrial = await trialRepository.findTypeTrialByName(dbTypeName, true);
    
    if (typeTrial) {
      whereClause.typeTrialId = typeTrial.id;
    }
  }

  const trials = await trialRepository.searchTrials(whereClause);

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
 
    const typeTrial = await trialRepository.findTypeTrialByName(dbTypeName);

    if (!typeTrial) {
      console.log(`No se encontró TypeTrial con nombre: ${dbTypeName}`);
      const allTypes = await trialRepository.findAllTypeTrials();
      console.log("TypeTrial disponibles:", allTypes.map(t => t.name));
      return { categories: [], count: 0 };
    }

    console.log(`TypeTrial encontrado: ${typeTrial.id} - ${typeTrial.name}`);
    const categories = await trialRepository.findCategoriesByTypeTrialId(typeTrial.id);

    console.log(`Categorías encontradas: ${categories.length}`);
    return { categories, count: categories.length };
  } catch (error) {
    console.error("Error en getCategoriesByTrialTypeService:", error);
    throw error;
  }
};

export const getAllTrialTypesService = async () => {
  try {
    const types = await trialRepository.findAllTypeTrials();

    return { types, count: types.length };
  } catch (error) {
    console.error("Error en getAllTrialTypesService:", error);
    throw error;
  }
};

export const getAllEntryTypesService = async () => {
  try {
    const entryTypes = await trialRepository.findAllEntryTypes();

    return { entryTypes, count: entryTypes.length };
  } catch (error) {
    console.error("Error en getAllEntryTypesService:", error);
    throw error;
  }
};