import { addActionService, editActionService, searchActionsService, deleteActionService, getActionsByTrialService, getAllDescriptionActionsService, addDescriptionActionService, getAllTypeActionsService, deleteDescriptionActionService, editDescriptionActionService } from "../services/action.service.js";

export const addAction = async (req, res) => {
  try {
    const { id, descriptionActionId, date, trialId, status, closeDate } = req.body;
    const result = await addActionService(id, descriptionActionId, date, trialId, status, closeDate);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editAction = async (req, res) => {
  try {
    const { id, descriptionActionId, date, trialId } = req.body;
    const result = await editActionService(id, descriptionActionId, date, trialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const searchActions = async (req, res) => {
  try {
    const { searchTerm, trialId } = req.query;
    const result = await searchActionsService(searchTerm, trialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteActionService(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getActionsByTrial = async (req, res) => {
  try {
    const { trialId } = req.params;
    const result = await getActionsByTrialService(trialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllDescriptionActions = async (req, res) => {
  try {
    const { typeTrialId } = req.query;
    const result = await getAllDescriptionActionsService(typeTrialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addDescriptionAction = async (req, res) => {
  try {
    const { description, typeActionId, typeTrialId } = req.body;
    const result = await addDescriptionActionService(description, typeActionId, typeTrialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllTypeActions = async (req, res) => {
  try {
    const result = await getAllTypeActionsService();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editDescriptionAction = async (req, res) => {
  try {
    const { id, description, typeActionId, typeTrialId } = req.body;
    const result = await editDescriptionActionService(id, description, typeActionId, typeTrialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDescriptionAction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDescriptionActionService(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

