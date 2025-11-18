import { v4 as uuidv4 } from "uuid";

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
    const hasTrial = Math.random() > 0.2;
    const trial = hasTrial ? trials[Math.floor(Math.random() * trials.length)] : null;

    let availableDescriptions = descriptionActions;

    if (trial && trial.typeTrial) {
      const trialTypeName = trial.typeTrial.name.toLowerCase();
      
      if (trialTypeName === "ordinario" || trialTypeName === "ejecutivo") {
        availableDescriptions = descriptionActions.filter(da => {
          if (!da.typeTrialId) return true;
          const daTypeName = da.typeTrial?.name?.toLowerCase();
          return daTypeName === "ordinario" || daTypeName === "ejecutivo";
        });
      } else if (trialTypeName === "tutela" || trialTypeName === "incidente de desacato") {
        availableDescriptions = descriptionActions.filter(da => {
          if (!da.typeTrialId) return true;
          const daTypeName = da.typeTrial?.name?.toLowerCase();
          return daTypeName === "tutela";
        });
      } else {
        availableDescriptions = descriptionActions.filter(da => {
          if (!da.typeTrialId) return true;
          return da.typeTrialId === trial.typeTrial.id;
        });
      }

      if (availableDescriptions.length === 0) {
        availableDescriptions = descriptionActions.filter(da => !da.typeTrialId);
        if (availableDescriptions.length === 0) {
          availableDescriptions = descriptionActions;
        }
      }
    } else {
      availableDescriptions = descriptionActions.filter(da => !da.typeTrialId);
      if (availableDescriptions.length === 0) {
        availableDescriptions = descriptionActions;
      }
    }

    const descriptionAction = availableDescriptions[Math.floor(Math.random() * availableDescriptions.length)];

    let id;
    do {
      id = uuidv4();
    } while (usedIds.has(id));
    usedIds.add(id);

    let date;
    if (trial) {
      const trialDate = new Date(trial.arrivalDate);
      const maxDate = trial.closeDate ? new Date(trial.closeDate) : new Date();
      const daysRange = Math.floor((maxDate - trialDate) / (1000 * 60 * 60 * 24));
      const randomDays = Math.floor(Math.random() * Math.max(1, daysRange));
      date = new Date(trialDate);
      date.setDate(date.getDate() + randomDays);
    } else {
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

