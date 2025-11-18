import { v4 as uuidv4 } from "uuid";

/**
 * Genera datos mock de personas
 * @param {number} count - Número de personas a generar
 * @returns {Array} Array de objetos de personas
 */
export const generatePeopleMocks = (count = 20) => {
  const firstNames = [
    "María", "José", "Carlos", "Ana", "Luis", "Laura", "Juan", "Carmen",
    "Pedro", "Sofía", "Miguel", "Isabella", "Fernando", "Valentina",
    "Ricardo", "Camila", "Andrés", "Mariana", "Diego", "Alejandra",
    "Roberto", "Daniela", "Jorge", "Natalia", "Alejandro", "Paola",
    "Sergio", "Andrea", "Felipe", "Diana", "Mauricio", "Carolina",
    "Cristian", "Juliana", "David", "Sara", "Gustavo", "Tatiana"
  ];

  const lastNames = [
    "García", "Rodríguez", "González", "Fernández", "López", "Martínez",
    "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández",
    "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
    "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez",
    "Serrano", "Blanco", "Suárez", "Molina", "Morales", "Ortega", "Delgado"
  ];

  const companies = [
    "Constructora ABC S.A.S.", "Comercial XYZ Ltda.", "Servicios Generales S.A.",
    "Inversiones Delta S.A.S.", "Tecnología Avanzada S.A.", "Distribuidora Norte S.A.S.",
    "Importaciones Sur Ltda.", "Exportaciones Este S.A.", "Logística Integral S.A.S.",
    "Consultoría Empresarial S.A.", "Manufacturas del Valle S.A.S.", "Agroindustria S.A."
  ];

  const people = [];
  const usedDocuments = new Set();

  for (let i = 0; i < count; i++) {
    let document, documentType, name;

    // 60% personas naturales, 40% empresas
    if (i % 10 < 6) {
      // Persona natural
      documentType = "Cédula";
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
      const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName1} ${lastName2}`;
      
      // Generar cédula colombiana válida (8-10 dígitos)
      let cedula;
      do {
        const length = Math.random() > 0.5 ? 10 : 8;
        cedula = Math.floor(Math.random() * (10 ** length - 10 ** (length - 1)) + 10 ** (length - 1)).toString();
      } while (usedDocuments.has(cedula));
      
      document = cedula;
    } else {
      // Empresa
      documentType = "NIT";
      name = companies[Math.floor(Math.random() * companies.length)];
      
      // Generar NIT colombiano (9 dígitos)
      let nit;
      do {
        nit = Math.floor(Math.random() * (10 ** 9 - 10 ** 8) + 10 ** 8).toString();
      } while (usedDocuments.has(nit));
      
      document = nit;
    }

    usedDocuments.add(document);

    people.push({
      id: uuidv4(),
      name,
      documentType,
      document
    });
  }

  return people;
};

