import { addTrialService, editTrialService, searchTrialsService, getCategoriesByTrialTypeService, getAllTrialTypesService, getAllEntryTypesService } from "../services/trial.service.js";

export const addTrial = async (req, res) => {
  try {
    const { id, number, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId } = req.body;
    const result = await addTrialService(id, number, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editTrial = async (req, res) => {
  try {
    const { id, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId } = req.body;
    const result = await editTrialService(id, typeTrialId, categoryId, plaintiffId, defendantId, arrivalDate, closeDate, status, entryTypeId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const searchTrials = async (req, res) => {
  try {
    const { searchTerm, filterType } = req.query;
    const result = await searchTrialsService(searchTerm, filterType);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategoriesByTrialType = async (req, res) => {
  try {
    const { trialType } = req.query;
    if (!trialType) {
      return res.status(400).json({ message: "El tipo de proceso es requerido" });
    }
    const result = await getCategoriesByTrialTypeService(trialType);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllTrialTypes = async (req, res) => {
  try {
    const result = await getAllTrialTypesService();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllEntryTypes = async (req, res) => {
  try {
    const result = await getAllEntryTypesService();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

