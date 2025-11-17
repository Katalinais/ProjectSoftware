import { v4 as uuidv4 } from "uuid";

/**
 * Genera datos mock de actuaciones (actions)
 * @param {Array} trials - Array de procesos disponibles (con typeTrial incluido)
 * @param {Array} descriptionActions - Array de descripciones de actuación disponibles (con typeTrial incluido)
 * @param {number} count - Número de actuaciones a generar
 * @returns {Array} Array de objetos de actuaciones
 */
export const generateActionsMocks = (trials = [], descriptionActions = [], count = 50) => {
  if (trials.length === 0) {
    throw new Error("Se necesitan procesos para generar actuaciones");
  }
  if (descriptionActions.length === 0) {
    throw new Error("Se necesitan descripciones de actuación para generar actuaciones");
  }

  const actions = [];
  const usedIds = new Set();

  for (let i = 0; i < count; i++) {
    // Seleccionar proceso aleatorio (80% con proceso, 20% sin proceso)
    const hasTrial = Math.random() > 0.2;
    const trial = hasTrial ? trials[Math.floor(Math.random() * trials.length)] : null;

    // Filtrar descripciones de actuación según el tipo de proceso
    let availableDescriptions = descriptionActions;

    if (trial && trial.typeTrial) {
      const trialTypeName = trial.typeTrial.name.toLowerCase();
      
      if (trialTypeName === "ordinario" || trialTypeName === "ejecutivo") {
        // Ordinario y Ejecutivo comparten descripciones
        availableDescriptions = descriptionActions.filter(da => {
          // Incluir descripciones generales (typeTrialId null)
          if (!da.typeTrialId) return true;
          // Incluir descripciones de Ordinario o Ejecutivo
          const daTypeName = da.typeTrial?.name?.toLowerCase();
          return daTypeName === "ordinario" || daTypeName === "ejecutivo";
        });
      } else if (trialTypeName === "tutela" || trialTypeName === "incidente de desacato") {
        // Tutela e Incidente de desacato comparten descripciones (y categorías)
        availableDescriptions = descriptionActions.filter(da => {
          // Incluir descripciones generales (typeTrialId null)
          if (!da.typeTrialId) return true;
          // Incluir descripciones de Tutela
          const daTypeName = da.typeTrial?.name?.toLowerCase();
          return daTypeName === "tutela";
        });
      } else {
        // Para otros tipos, usar descripciones específicas del tipo o generales
        availableDescriptions = descriptionActions.filter(da => {
          if (!da.typeTrialId) return true; // Generales
          return da.typeTrialId === trial.typeTrial.id;
        });
      }

      // Si no hay descripciones específicas, usar todas (generales)
      if (availableDescriptions.length === 0) {
        availableDescriptions = descriptionActions.filter(da => !da.typeTrialId);
        if (availableDescriptions.length === 0) {
          availableDescriptions = descriptionActions; // Fallback: usar todas
        }
      }
    } else {
      // Sin proceso: usar solo descripciones generales
      availableDescriptions = descriptionActions.filter(da => !da.typeTrialId);
      if (availableDescriptions.length === 0) {
        availableDescriptions = descriptionActions; // Fallback: usar todas
      }
    }

    // Seleccionar descripción de actuación de las disponibles
    const descriptionAction = availableDescriptions[Math.floor(Math.random() * availableDescriptions.length)];

    // Generar ID único
    let id;
    do {
      id = uuidv4();
    } while (usedIds.has(id));
    usedIds.add(id);

    // Generar fecha (últimos 2 años, o dentro del rango del proceso si tiene)
    let date;
    if (trial) {
      const trialDate = new Date(trial.arrivalDate);
      const maxDate = trial.closeDate ? new Date(trial.closeDate) : new Date();
      const daysRange = Math.floor((maxDate - trialDate) / (1000 * 60 * 60 * 24));
      const randomDays = Math.floor(Math.random() * Math.max(1, daysRange));
      date = new Date(trialDate);
      date.setDate(date.getDate() + randomDays);
    } else {
      // Fecha aleatoria en los últimos 2 años
      const now = new Date();
      const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      const daysDiff = Math.floor((now - twoYearsAgo) / (1000 * 60 * 60 * 24));
      const randomDays = Math.floor(Math.random() * daysDiff);
      date = new Date(twoYearsAgo);
      date.setDate(date.getDate() + randomDays);
    }

    actions.push({
      id,
      descriptionActionId: descriptionAction.id,
      trialId: trial ? trial.id : null,
      date
    });
  }

  return actions;
};

