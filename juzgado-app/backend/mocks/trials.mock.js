import { v4 as uuidv4 } from "uuid";
import { Status } from "@prisma/client";

/**
 * Genera datos mock de procesos (trials)
 * @param {Array} people - Array de personas disponibles (para usar como demandantes y demandados)
 * @param {Array} typeTrials - Array de tipos de proceso disponibles
 * @param {Array} categories - Array de categorías disponibles
 * @param {Array} entryTypes - Array de tipos de entrada disponibles
 * @param {number} count - Número de procesos a generar
 * @param {Array} existingTrials - Array de procesos ya creados (para Incidentes de desacato)
 * @returns {Array} Array de objetos de procesos
 */
export const generateTrialsMocks = (people = [], typeTrials = [], categories = [], entryTypes = [], count = 30, existingTrials = []) => {
  if (people.length < 2) {
    throw new Error("Se necesitan al menos 2 personas para generar procesos");
  }
  if (typeTrials.length === 0) {
    throw new Error("Se necesitan tipos de proceso para generar procesos");
  }
  if (entryTypes.length === 0) {
    throw new Error("Se necesitan tipos de entrada para generar procesos");
  }

  const statuses = [Status.PRIMERA_INSTANCIA, Status.SEGUNDA_INSTANCIA, Status.ARCHIVADO];
  const years = [2020, 2021, 2022, 2023, 2024];
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  
  const trials = [];
  const usedNumbers = new Set();

  // Separar tipos de proceso
  const tutelaType = typeTrials.find(tt => tt.name.toLowerCase() === "tutela");
  const desacatoType = typeTrials.find(tt => tt.name.toLowerCase() === "incidente de desacato");
  const otherTypes = typeTrials.filter(tt => {
    const name = tt.name.toLowerCase();
    return name !== "tutela" && name !== "incidente de desacato";
  });

  // Filtrar Tutelas existentes para usar en Incidentes de desacato
  const tutelaTrials = existingTrials.filter(t => {
    const trialTypeId = t.typeTrialId || t.typeTrial?.id;
    return trialTypeId === tutelaType?.id;
  });

  for (let i = 0; i < count; i++) {
    // Seleccionar personas aleatorias (asegurarse de que sean diferentes)
    let plaintiff, defendant;
    do {
      plaintiff = people[Math.floor(Math.random() * people.length)];
      defendant = people[Math.floor(Math.random() * people.length)];
    } while (plaintiff.id === defendant.id);

    let typeTrial, category, number, arrivalDate;

    // 20% de probabilidad de crear Incidente de desacato (solo si hay Tutelas disponibles)
    const shouldCreateDesacato = desacatoType && tutelaType && tutelaTrials.length > 0 && Math.random() < 0.2;

    if (shouldCreateDesacato) {
      // Crear Incidente de desacato basado en una Tutela existente
      const tutelaTrial = tutelaTrials[Math.floor(Math.random() * tutelaTrials.length)];
      typeTrial = desacatoType;
      number = tutelaTrial.number; // Mismo número que la Tutela
      
      // Usar categorías de Tutela para el Incidente de desacato
      const tutelaCategories = categories.filter(cat => cat.typeTrialId === tutelaType.id);
      if (tutelaCategories.length > 0) {
        category = tutelaCategories[Math.floor(Math.random() * tutelaCategories.length)];
      }

      // Fecha de llegada después de la Tutela (entre 30 y 180 días después)
      const tutelaDate = new Date(tutelaTrial.arrivalDate);
      const daysAfter = Math.floor(Math.random() * 150) + 30;
      arrivalDate = new Date(tutelaDate);
      arrivalDate.setDate(arrivalDate.getDate() + daysAfter);
    } else {
      // Crear proceso normal
      // 30% de probabilidad de crear Tutela (para que haya suficientes para Incidentes)
      const shouldCreateTutela = tutelaType && Math.random() < 0.3;
      
      if (shouldCreateTutela) {
        typeTrial = tutelaType;
      } else {
        // Seleccionar de otros tipos (excluyendo desacato)
        const availableTypes = otherTypes.length > 0 ? otherTypes : typeTrials.filter(tt => tt.id !== desacatoType?.id);
        typeTrial = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      }

      // Seleccionar categoría (si el tipo de proceso no es "Pagos por consignación")
      const typeTrialName = typeTrial.name.toLowerCase();
      const isPagoPorConsignacion = typeTrialName.includes("pago") && 
                                    (typeTrialName.includes("consignacion") || typeTrialName.includes("consignación"));
      
      if (!isPagoPorConsignacion) {
        // Filtrar categorías por tipo de proceso
        const availableCategories = categories.filter(cat => cat.typeTrialId === typeTrial.id);
        if (availableCategories.length > 0) {
          category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        }
      }

      // Generar número de proceso único (formato: año-radicado)
      do {
        const year = years[Math.floor(Math.random() * years.length)];
        const radicado = Math.floor(Math.random() * 99999) + 1;
        number = `${year}-${radicado.toString().padStart(5, "0")}`;
      } while (usedNumbers.has(number));
      usedNumbers.add(number);

      // Generar fecha de llegada (últimos 5 años)
      const year = years[Math.floor(Math.random() * years.length)];
      const month = months[Math.floor(Math.random() * months.length)];
      const day = Math.floor(Math.random() * 28) + 1; // Evitar problemas con febrero
      arrivalDate = new Date(year, month, day);
    }

    // Seleccionar tipo de entrada
    const entryType = entryTypes[Math.floor(Math.random() * entryTypes.length)];

    // Seleccionar estado
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Si está archivado, generar fecha de cierre (después de la fecha de llegada)
    let closeDate = null;
    if (status === Status.ARCHIVADO) {
      const daysAfter = Math.floor(Math.random() * 365) + 30; // Entre 30 y 395 días después
      closeDate = new Date(arrivalDate);
      closeDate.setDate(closeDate.getDate() + daysAfter);
    }

    trials.push({
      id: uuidv4(),
      number,
      plaintiffId: plaintiff.id,
      defendantId: defendant.id,
      typeTrialId: typeTrial.id,
      categoryId: category ? category.id : null,
      entryTypeId: entryType.id,
      arrivalDate,
      closeDate,
      status
    });
  }

  return trials;
};

