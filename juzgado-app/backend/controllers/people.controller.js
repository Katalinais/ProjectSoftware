import { addPersonService, editPersonService, searchPeopleService } from "../services/people.service.js";

export const addPerson = async (req, res) => {
  try {
    const { name, documentType, document } = req.body;
    const result = await addPersonService(name, documentType, document);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editPerson = async (req, res) => {
  try {
    const { id, name, documentType, document } = req.body;
    const result = await editPersonService(id, name, documentType, document);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const searchPeople = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const result = await searchPeopleService(searchTerm);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};