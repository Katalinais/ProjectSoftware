import * as trialRepository from "../repositories/trial.repository.js";
import * as peopleRepository from "../repositories/people.repository.js";
import * as actionRepository from "../repositories/action.repository.js";

export const getStatisticsService = async (startDate, endDate) => {
  try {
    const trialWhereClause = {};
    if (startDate || endDate) {
      trialWhereClause.arrivalDate = {};
      if (startDate) {
        trialWhereClause.arrivalDate.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        trialWhereClause.arrivalDate.lte = endDateObj;
      }
    }

    const trials = await trialRepository.searchTrials(trialWhereClause);

    const people = await peopleRepository.findAllPeople();

    const actionWhereClause = {};
    if (startDate || endDate) {
      actionWhereClause.date = {};
      if (startDate) {
        actionWhereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        actionWhereClause.date.lte = endDateObj;
      }
    }

    const actions = await actionRepository.searchActions(actionWhereClause);

    const descriptionActions = await actionRepository.findDescriptionActions({});

    const trialsByType = {};
    trials.forEach((trial) => {
      const typeName = trial.typeTrial?.name || "Sin tipo";
      trialsByType[typeName] = (trialsByType[typeName] || 0) + 1;
    });

    const trialsByTypeArray = Object.entries(trialsByType).map(([name, value]) => ({
      name,
      value
    }));

    const peopleByDocumentType = {};
    people.forEach((person) => {
      const docType = person.documentType || "Sin tipo";
      peopleByDocumentType[docType] = (peopleByDocumentType[docType] || 0) + 1;
    });

    const peopleByDocumentTypeArray = Object.entries(peopleByDocumentType).map(([name, value]) => ({
      name,
      value
    }));

    const actionsByType = {};
    actions.forEach((action) => {
      const typeName = action.descriptionAction?.typeAction?.description || "Sin tipo";
      actionsByType[typeName] = (actionsByType[typeName] || 0) + 1;
    });

    const actionsByTypeArray = Object.entries(actionsByType).map(([name, value]) => ({
      name,
      value
    }));

    const ejecutivoType = await trialRepository.findTypeTrialByName("Ejecutivo");
    const ordinarioType = await trialRepository.findTypeTrialByName("Ordinario");

    const ejecutivoCategories = ejecutivoType 
      ? await trialRepository.findCategoriesByTypeTrialId(ejecutivoType.id)
      : [];
    const ordinarioCategories = ordinarioType
      ? await trialRepository.findCategoriesByTypeTrialId(ordinarioType.id)
      : [];

    const entryTypes = await trialRepository.findAllEntryTypes();

    const typeActions = await actionRepository.findAllTypeActions();
    const autoType = typeActions.find(ta => ta.description.toLowerCase().includes("auto"));
    const sentenciaType = typeActions.find(ta => ta.description.toLowerCase().includes("sentencia"));

    const autoDescriptions = descriptionActions.filter(da => {
      const typeActionName = da.typeAction?.description?.toLowerCase() || "";
      const isAuto = typeActionName.includes("auto");
      const typeTrialName = da.typeTrial?.name?.toLowerCase() || "";
      const isEjecutivoOrdinario = !da.typeTrialId || typeTrialName === "ejecutivo" || typeTrialName === "ordinario";
      return isAuto && isEjecutivoOrdinario;
    });

    const ejecutivoOrdinarioTrials = trials.filter(trial => {
      const typeName = trial.typeTrial?.name?.toLowerCase();
      return typeName === "ejecutivo" || typeName === "ordinario";
    });

    const matrixData = {};

    [...ejecutivoCategories, ...ordinarioCategories].forEach(category => {
      matrixData[category.id] = {
        categoryName: category.description,
        typeTrialName: ejecutivoCategories.find(c => c.id === category.id) ? "Ejecutivo" : "Ordinario",
        entryTypes: {},
        autoDescriptions: {},
        totalSentencias: 0
      };

      entryTypes.forEach(entryType => {
        matrixData[category.id].entryTypes[entryType.id] = 0;
      });

      autoDescriptions.forEach(autoDesc => {
        matrixData[category.id].autoDescriptions[autoDesc.id] = 0;
      });
    });

    ejecutivoOrdinarioTrials.forEach(trial => {
      if (trial.categoryId && matrixData[trial.categoryId]) {   
        if (trial.entryTypeId) {
          matrixData[trial.categoryId].entryTypes[trial.entryTypeId] = 
            (matrixData[trial.categoryId].entryTypes[trial.entryTypeId] || 0) + 1;
        }
      }
    });

    ejecutivoOrdinarioTrials.forEach(trial => {
      if (trial.categoryId && matrixData[trial.categoryId] && trial.actions) {
        trial.actions.forEach(action => {
          const descriptionAction = action.descriptionAction;
          if (!descriptionAction) return;

          const typeActionName = descriptionAction.typeAction?.description?.toLowerCase() || "";
          const isAuto = typeActionName.includes("auto");
          const isSentencia = typeActionName.includes("sentencia");

          if (isAuto && descriptionAction.id) {
            if (matrixData[trial.categoryId].autoDescriptions[descriptionAction.id] !== undefined) {
              matrixData[trial.categoryId].autoDescriptions[descriptionAction.id] = 
                (matrixData[trial.categoryId].autoDescriptions[descriptionAction.id] || 0) + 1;
            }
          } else if (isSentencia) {
            matrixData[trial.categoryId].totalSentencias = 
              (matrixData[trial.categoryId].totalSentencias || 0) + 1;
          }
        });
      }
    });

    const tutelaType = await trialRepository.findTypeTrialByName("Tutela");
    const tutelaCategories = tutelaType 
      ? await trialRepository.findCategoriesByTypeTrialId(tutelaType.id)
      : [];

    const tutelaAutoDescriptions = descriptionActions.filter(da => {
      const typeActionName = da.typeAction?.description?.toLowerCase() || "";
      const isAuto = typeActionName.includes("auto");
      const typeTrialName = da.typeTrial?.name?.toLowerCase() || "";
      const isTutela = !da.typeTrialId || typeTrialName === "tutela";
      return isAuto && isTutela;
    });

    const tutelaSentenciaDescriptions = descriptionActions.filter(da => {
      const typeActionName = da.typeAction?.description?.toLowerCase() || "";
      const isSentencia = typeActionName.includes("sentencia");
      const typeTrialName = da.typeTrial?.name?.toLowerCase() || "";
      const isTutela = !da.typeTrialId || typeTrialName === "tutela";
      return isSentencia && isTutela;
    });

    const tutelaTrials = trials.filter(trial => {
      const typeName = trial.typeTrial?.name?.toLowerCase();
      return typeName === "tutela";
    });

    const tutelaMatrixData = {};

    tutelaCategories.forEach(category => {
      tutelaMatrixData[category.id] = {
        categoryName: category.description,
        entryTypes: {},
        autoDescriptions: {},
        sentenciaDescriptions: {}
      };

      entryTypes.forEach(entryType => {
        tutelaMatrixData[category.id].entryTypes[entryType.id] = 0;
      });

      tutelaAutoDescriptions.forEach(autoDesc => {
        tutelaMatrixData[category.id].autoDescriptions[autoDesc.id] = 0;
      });

      tutelaSentenciaDescriptions.forEach(sentenciaDesc => {
        tutelaMatrixData[category.id].sentenciaDescriptions[sentenciaDesc.id] = 0;
      });
    });

    tutelaTrials.forEach(trial => {
      if (trial.categoryId && tutelaMatrixData[trial.categoryId]) {
        if (trial.entryTypeId) {
          tutelaMatrixData[trial.categoryId].entryTypes[trial.entryTypeId] = 
            (tutelaMatrixData[trial.categoryId].entryTypes[trial.entryTypeId] || 0) + 1;
        }
      }
    });
    
    tutelaTrials.forEach(trial => {
      if (trial.categoryId && tutelaMatrixData[trial.categoryId] && trial.actions) {
        trial.actions.forEach(action => {
          const descriptionAction = action.descriptionAction;
          if (!descriptionAction) return;

          const typeActionName = descriptionAction.typeAction?.description?.toLowerCase() || "";
          const isAuto = typeActionName.includes("auto");
          const isSentencia = typeActionName.includes("sentencia");

          if (isAuto && descriptionAction.id) {
            if (tutelaMatrixData[trial.categoryId].autoDescriptions[descriptionAction.id] !== undefined) {
              tutelaMatrixData[trial.categoryId].autoDescriptions[descriptionAction.id] = 
                (tutelaMatrixData[trial.categoryId].autoDescriptions[descriptionAction.id] || 0) + 1;
            }
          } else if (isSentencia && descriptionAction.id) {
            if (tutelaMatrixData[trial.categoryId].sentenciaDescriptions[descriptionAction.id] !== undefined) {
              tutelaMatrixData[trial.categoryId].sentenciaDescriptions[descriptionAction.id] = 
                (tutelaMatrixData[trial.categoryId].sentenciaDescriptions[descriptionAction.id] || 0) + 1;
            }
          }
        });
      }
    });

    return {
      totalTrials: trials.length,
      totalPeople: people.length,
      totalActions: actions.length,
      totalDescriptions: descriptionActions.length,
      trialsByType: trialsByTypeArray,
      peopleByDocumentType: peopleByDocumentTypeArray,
      actionsByType: actionsByTypeArray,
      trials: trials,
      matrixData: matrixData, 
      entryTypes: entryTypes, 
      autoDescriptions: autoDescriptions,
      tutelaMatrixData: tutelaMatrixData,
      tutelaCategories: tutelaCategories,
      tutelaEntryTypes: entryTypes,
      tutelaAutoDescriptions: tutelaAutoDescriptions,
      tutelaSentenciaDescriptions: tutelaSentenciaDescriptions
    };
  } catch (error) {
    console.error("Error en getStatisticsService:", error);
    throw error;
  }
};

