import { registerAdminService, loginAdminService } from "../services/auth.service.js";

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await registerAdminService(username, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginAdminService(username, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};