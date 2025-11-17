import * as peopleRepository from "../repositories/people.repository.js";

export const addPersonService = async (name, documentType, document) => {
  const existing = await peopleRepository.findPersonByDocument(document);
  if (existing) {
    throw new Error("La persona ya está registrada");
  }

  await peopleRepository.createPerson(name, documentType, document);

  return { message: "Persona creada correctamente ✅" };
};

export const editPersonService = async (id, name, documentType, document) => {
  const person = await peopleRepository.findPersonById(id);
  if (!person) {
    throw new Error("La persona no existe");
  }

  // Si el documento cambió, verificar que no exista otro con ese documento
  if (document !== person.document) {
    const existing = await peopleRepository.findPersonByDocument(document);
    if (existing) {
      throw new Error("Ya existe una persona con ese número de documento");
    }
  }

  await peopleRepository.updatePerson(id, name, documentType, document);

  return { message: "Persona actualizada correctamente ✅" };
};

export const searchPeopleService = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") {
    const people = await peopleRepository.findAllPeople();
    return { people, count: people.length };
  }

  const people = await peopleRepository.searchPeople(searchTerm);

  return { people, count: people.length };
};