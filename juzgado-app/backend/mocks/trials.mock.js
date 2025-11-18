import { v4 as uuidv4 } from "uuid";
import { Status } from "@prisma/client";

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

  const tutelaType = typeTrials.find(tt => tt.name.toLowerCase() === "tutela");
  const desacatoType = typeTrials.find(tt => tt.name.toLowerCase() === "incidente de desacato");
  const otherTypes = typeTrials.filter(tt => {
    const name = tt.name.toLowerCase();
    return name !== "tutela" && name !== "incidente de desacato";
  });

  const tutelaTrials = existingTrials.filter(t => {
    const trialTypeId = t.typeTrialId || t.typeTrial?.id;
    return trialTypeId === tutelaType?.id;
  });

  for (let i = 0; i < count; i++) {
    let plaintiff, defendant;
    do {
      plaintiff = people[Math.floor(Math.random() * people.length)];
      defendant = people[Math.floor(Math.random() * people.length)];
    } while (plaintiff.id === defendant.id);

    let typeTrial, category, number, arrivalDate;

    const shouldCreateDesacato = desacatoType && tutelaType && tutelaTrials.length > 0 && Math.random() < 0.2;

    if (shouldCreateDesacato) { 
      const tutelaTrial = tutelaTrials[Math.floor(Math.random() * tutelaTrials.length)];
      typeTrial = desacatoType;
      number = tutelaTrial.number;
      
      const tutelaCategories = categories.filter(cat => cat.typeTrialId === tutelaType.id);
      if (tutelaCategories.length > 0) {
        category = tutelaCategories[Math.floor(Math.random() * tutelaCategories.length)];
      }

      const tutelaDate = new Date(tutelaTrial.arrivalDate);
      const daysAfter = Math.floor(Math.random() * 150) + 30;
      arrivalDate = new Date(tutelaDate);
      arrivalDate.setDate(arrivalDate.getDate() + daysAfter);
    } else {
      const shouldCreateTutela = tutelaType && Math.random() < 0.3;
      
      if (shouldCreateTutela) {
        typeTrial = tutelaType;
      } else {
        const availableTypes = otherTypes.length > 0 ? otherTypes : typeTrials.filter(tt => tt.id !== desacatoType?.id);
        typeTrial = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      }

      const typeTrialName = typeTrial.name.toLowerCase();
      const isPagoPorConsignacion = typeTrialName.includes("pago") && 
                                    (typeTrialName.includes("consignacion") || typeTrialName.includes("consignación"));
      
      if (!isPagoPorConsignacion) {
        const availableCategories = categories.filter(cat => cat.typeTrialId === typeTrial.id);
        if (availableCategories.length > 0) {
          category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        }
      }

      do {
        const year = years[Math.floor(Math.random() * years.length)];
        const radicado = Math.floor(Math.random() * 99999) + 1;
        number = `${year}-${radicado.toString().padStart(5, "0")}`;
      } while (usedNumbers.has(number));
      usedNumbers.add(number);

      const year = years[Math.floor(Math.random() * years.length)];
      const month = months[Math.floor(Math.random() * months.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      arrivalDate = new Date(year, month, day);
    }

    const entryType = entryTypes[Math.floor(Math.random() * entryTypes.length)];

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    let closeDate = null;
    if (status === Status.ARCHIVADO) {
      const daysAfter = Math.floor(Math.random() * 365) + 30;
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

