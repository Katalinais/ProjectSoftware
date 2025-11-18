import * as actionRepository from "../repositories/action.repository.js";
import * as trialRepository from "../repositories/trial.repository.js";
import { updateTrialStatusService } from "./trial.service.js";

export const addActionService  = async (id, descriptionActionId, date, trialId, status, closeDate) => {
    const existing = await actionRepository.findActionById(id);
    if (existing) {
      throw new Error("La acción ya está registrada");
    }

    await actionRepository.createAction(id, descriptionActionId, date, trialId);

    if (status && trialId) {
      await updateTrialStatusService(trialId, status, closeDate);
    }

    return { message: "Acción creada correctamente" };
  };

  export const editActionService = async (id, descriptionActionId, date, trialId) => {
    const action = await actionRepository.findActionById(id);
    if (!action) {
      throw new Error("La acción no existe");
    }
    await actionRepository.updateAction(id, descriptionActionId, date, trialId);
    return { message: "Acción actualizada correctamente" };
  };

export const searchActionsService = async (searchTerm, trialId) => {
  const whereClause = {};

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

  if (trialId && trialId.trim() !== "") {
    whereClause.trialId = trialId;
  }

  const actions = await actionRepository.searchActions(whereClause);

  return { actions, count: actions.length };
};

export const deleteActionService = async (id) => {
  const action = await actionRepository.findActionById(id);
  if (!action) {
    throw new Error("La acción no existe");
  }

  await actionRepository.deleteAction(id);

  return { message: "Acción eliminada correctamente" };
};

export const getActionsByTrialService = async (trialId) => {
  const actions = await actionRepository.findActionsByTrialId(trialId);

  return { actions, count: actions.length };
};

export const getAllDescriptionActionsService = async (typeTrialId) => {
  try {
    const whereClause = {};
  
    if (typeTrialId) {
      const typeTrial = await trialRepository.findTypeTrialById(typeTrialId);

      if (typeTrial) {
        const typeTrialName = typeTrial.name.toLowerCase();
        
        if (typeTrialName === "ordinario" || typeTrialName === "ejecutivo") {
          const ordinarioType = await trialRepository.findTypeTrialByName("Ordinario");
          const ejecutivoType = await trialRepository.findTypeTrialByName("Ejecutivo");

          const typeTrialIds = [];
          if (ordinarioType) typeTrialIds.push(ordinarioType.id);
          if (ejecutivoType) typeTrialIds.push(ejecutivoType.id);

          whereClause.OR = [
            { typeTrialId: { in: typeTrialIds } },
            { typeTrialId: null }
          ];
        } else {
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
    
    const descriptionActions = await actionRepository.findDescriptionActions(whereClause);

    return { descriptionActions, count: descriptionActions.length };
  } catch (error) {
    console.error("Error en getAllDescriptionActionsService:", error);
    throw error;
  }
};

export const getAllTypeActionsService = async () => {
  try {
    const typeActions = await actionRepository.findAllTypeActions();

    return { typeActions, count: typeActions.length };
  } catch (error) {
    console.error("Error en getAllTypeActionsService:", error);
    throw error;
  }
};

export const addDescriptionActionService = async (description, typeActionId, typeTrialId) => {
  const typeAction = await actionRepository.findTypeActionById(typeActionId);
  if (!typeAction) {
    throw new Error("El tipo de acción no existe");
  }

  if (typeTrialId) {
    const typeTrial = await trialRepository.findTypeTrialById(typeTrialId);
    if (!typeTrial) {
      throw new Error("El tipo de proceso no existe");
    }
  }

  const existing = await actionRepository.findDescriptionActionByFields(description, typeActionId, typeTrialId);
  if (existing) {
    throw new Error("Ya existe una descripción con ese nombre para este tipo de acción y tipo de proceso");
  }

  const newDescriptionAction = await actionRepository.createDescriptionAction(description, typeActionId, typeTrialId);

  return { 
    message: "Descripción de acción creada correctamente",
    descriptionAction: newDescriptionAction
  };
};

export const editDescriptionActionService = async (id, description, typeActionId, typeTrialId) => {
  const descriptionAction = await actionRepository.findDescriptionActionById(id);
  if (!descriptionAction) {
    throw new Error("La descripción de acción no existe");
  }

  const typeAction = await actionRepository.findTypeActionById(typeActionId);
  if (!typeAction) {
    throw new Error("El tipo de acción no existe");
  }

  if (typeTrialId) {
    const typeTrial = await trialRepository.findTypeTrialById(typeTrialId);
    if (!typeTrial) {
      throw new Error("El tipo de proceso no existe");
    }
  }

  const existing = await actionRepository.findDescriptionActionByFields(description, typeActionId, typeTrialId, id);
  if (existing) {
    throw new Error("Ya existe una descripción con ese nombre para este tipo de acción y tipo de proceso");
  }

  const updatedDescriptionAction = await actionRepository.updateDescriptionAction(id, description, typeActionId, typeTrialId);

  return { 
    message: "Descripción de acción actualizada correctamente",
    descriptionAction: updatedDescriptionAction
  };
};

export const deleteDescriptionActionService = async (id) => {
  const descriptionAction = await actionRepository.findDescriptionActionById(id);
  if (!descriptionAction) {
    throw new Error("La descripción de acción no existe");
  }

  const actionsCount = await actionRepository.countActionsByDescriptionActionId(id);

  if (actionsCount > 0) {
    throw new Error("No se puede eliminar la descripción porque tiene acciones asociadas");
  }

  await actionRepository.deleteDescriptionAction(id);

  return { message: "Descripción de acción eliminada correctamente" };
};