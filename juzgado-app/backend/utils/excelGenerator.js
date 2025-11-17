import ExcelJS from "exceljs";

/**
 * Genera un archivo Excel con estadísticas de procesos, personas y actuaciones
 * @param {Object} stats - Objeto con las estadísticas
 * @param {Date} startDate - Fecha de inicio del reporte
 * @param {Date} endDate - Fecha de fin del reporte
 * @returns {Promise<Buffer>} Buffer del archivo Excel
 */
export const generateStatisticsExcel = async (stats, startDate, endDate) => {
  const workbook = new ExcelJS.Workbook();
  
  // Formato de fechas
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const dateRange = `Del ${formatDate(startDate)} al ${formatDate(endDate)}`;

  // Hoja 1: Matriz de Categorías x (Tipos de Entrada + Descripciones Auto + Total Sentencias)
  const matrixSheet = workbook.addWorksheet("Matriz Categorías");
  
  // Obtener datos de la matriz
  const matrixData = stats.matrixData || {};
  const entryTypes = stats.entryTypes || [];
  const autoDescriptions = stats.autoDescriptions || [];

  // Agregar título y período primero
  matrixSheet.addRow(["REPORTE DE ESTADÍSTICAS - MATRIZ DE CATEGORÍAS"]);
  matrixSheet.addRow(["Período", dateRange]);
  matrixSheet.addRow([""]);
  
  // Crear encabezados
  const headerRow = ["Categoría"];
  
  // Agregar tipos de entrada como columnas
  entryTypes.forEach(entryType => {
    headerRow.push(entryType.description);
  });
  
  // Agregar descripciones de auto como columnas
  autoDescriptions.forEach(autoDesc => {
    headerRow.push(autoDesc.description);
  });
  
  // Agregar columna de total de sentencias
  headerRow.push("Total Sentencias");

  matrixSheet.addRow(headerRow);
  
  // Estilo para el título (fila 1)
  const titleRow = matrixSheet.getRow(1);
  titleRow.font = { bold: true, size: 14 };
  titleRow.alignment = { horizontal: "center" };
  
  // Calcular la última columna para el merge (manejar más de 26 columnas)
  const getColumnLetter = (num) => {
    let result = '';
    while (num > 0) {
      num--;
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  };
  const lastColumn = getColumnLetter(headerRow.length);
  matrixSheet.mergeCells(`A1:${lastColumn}1`);
  
  // Estilo para el encabezado de datos (fila 4)
  const headerRowObj = matrixSheet.getRow(4);
  headerRowObj.font = { bold: true, size: 11 };
  headerRowObj.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" }
  };
  headerRowObj.font = { ...headerRowObj.font, color: { argb: "FFFFFFFF" } };
  headerRowObj.alignment = { horizontal: "center", vertical: "middle" };

  // Agregar filas de datos por categoría
  // Primero ordenar: Ordinario primero, luego Ejecutivo
  const sortedCategories = Object.values(matrixData).sort((a, b) => {
    // Ordinario primero (índice menor), Ejecutivo después (índice mayor)
    if (a.typeTrialName === "Ordinario" && b.typeTrialName === "Ejecutivo") return -1;
    if (a.typeTrialName === "Ejecutivo" && b.typeTrialName === "Ordinario") return 1;
    // Si son del mismo tipo, ordenar alfabéticamente por nombre de categoría
    return a.categoryName.localeCompare(b.categoryName);
  });

  sortedCategories.forEach(categoryData => {
    // Formato: "Tipo de Proceso - Categoría"
    const categoryLabel = `${categoryData.typeTrialName} - ${categoryData.categoryName}`;
    const row = [categoryLabel];
    
    // Agregar conteos de tipos de entrada
    entryTypes.forEach(entryType => {
      row.push(categoryData.entryTypes[entryType.id] || 0);
    });
    
    // Agregar conteos de descripciones de auto
    autoDescriptions.forEach(autoDesc => {
      row.push(categoryData.autoDescriptions[autoDesc.id] || 0);
    });
    
    // Agregar total de sentencias
    row.push(categoryData.totalSentencias || 0);
    
    matrixSheet.addRow(row);
  });

  // Ajustar ancho de columnas
  matrixSheet.columns = [
    { width: 30 }, // Columna de categorías
    ...Array(entryTypes.length).fill({ width: 20 }), // Columnas de tipos de entrada
    ...Array(autoDescriptions.length).fill({ width: 25 }), // Columnas de descripciones de auto
    { width: 18 } // Columna de total sentencias
  ];

  // Congelar primera columna y fila de encabezados
  matrixSheet.views = [{
    state: "frozen",
    xSplit: 1,
    ySplit: 4,
    topLeftCell: "B5",
    activeCell: "B5"
  }];

  // Hoja 2: Resumen General
  const summarySheet = workbook.addWorksheet("Resumen General");
  summarySheet.columns = [
    { width: 30 },
    { width: 20 }
  ];

  summarySheet.addRow(["REPORTE DE ESTADÍSTICAS", ""]);
  summarySheet.addRow(["Período", dateRange]);
  summarySheet.addRow([""]);
  summarySheet.addRow(["RESUMEN GENERAL", ""]);
  summarySheet.addRow(["Total de Procesos", stats.totalTrials || 0]);
  summarySheet.addRow(["Total de Personas", stats.totalPeople || 0]);
  summarySheet.addRow(["Total de Actuaciones", stats.totalActions || 0]);
  summarySheet.addRow(["Total de Descripciones", stats.totalDescriptions || 0]);
  summarySheet.addRow([""]);

  // Estilo para el título
  summarySheet.getRow(1).font = { bold: true, size: 16 };
  summarySheet.getRow(4).font = { bold: true, size: 12 };
  summarySheet.getRow(1).alignment = { horizontal: "center" };
  summarySheet.mergeCells("A1:B1");

  // Hoja 2: Procesos por Tipo
  if (stats.trialsByType && stats.trialsByType.length > 0) {
    const trialsSheet = workbook.addWorksheet("Procesos por Tipo");
    trialsSheet.columns = [
      { width: 30 },
      { width: 15 }
    ];

    trialsSheet.addRow(["Tipo de Proceso", "Cantidad"]);
    trialsSheet.getRow(1).font = { bold: true };
    trialsSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" }
    };
    trialsSheet.getRow(1).font = { ...trialsSheet.getRow(1).font, color: { argb: "FFFFFFFF" } };

    stats.trialsByType.forEach((item) => {
      trialsSheet.addRow([item.name, item.value]);
    });

    // Agregar total
    const totalRow = trialsSheet.addRow(["TOTAL", stats.totalTrials || 0]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" }
    };
  }

  // Hoja 3: Personas por Tipo de Documento
  if (stats.peopleByDocumentType && stats.peopleByDocumentType.length > 0) {
    const peopleSheet = workbook.addWorksheet("Personas por Tipo");
    peopleSheet.columns = [
      { width: 30 },
      { width: 15 }
    ];

    peopleSheet.addRow(["Tipo de Documento", "Cantidad"]);
    peopleSheet.getRow(1).font = { bold: true };
    peopleSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF70AD47" }
    };
    peopleSheet.getRow(1).font = { ...peopleSheet.getRow(1).font, color: { argb: "FFFFFFFF" } };

    stats.peopleByDocumentType.forEach((item) => {
      peopleSheet.addRow([item.name, item.value]);
    });

    // Agregar total
    const totalRow = peopleSheet.addRow(["TOTAL", stats.totalPeople || 0]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2EFDA" }
    };
  }

  // Hoja 4: Actuaciones por Tipo
  if (stats.actionsByType && stats.actionsByType.length > 0) {
    const actionsSheet = workbook.addWorksheet("Actuaciones por Tipo");
    actionsSheet.columns = [
      { width: 40 },
      { width: 15 }
    ];

    actionsSheet.addRow(["Tipo de Actuación", "Cantidad"]);
    actionsSheet.getRow(1).font = { bold: true };
    actionsSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF7030A0" }
    };
    actionsSheet.getRow(1).font = { ...actionsSheet.getRow(1).font, color: { argb: "FFFFFFFF" } };

    stats.actionsByType.forEach((item) => {
      actionsSheet.addRow([item.name, item.value]);
    });

    // Agregar total
    const totalRow = actionsSheet.addRow(["TOTAL", stats.totalActions || 0]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE7D9F2" }
    };
  }

  // Hoja 5: Detalle de Procesos
  if (stats.trials && stats.trials.length > 0) {
    const trialsDetailSheet = workbook.addWorksheet("Detalle de Procesos");
    trialsDetailSheet.columns = [
      { width: 15 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ];

    trialsDetailSheet.addRow([
      "Número",
      "Tipo",
      "Demandante",
      "Demandado",
      "Fecha Llegada",
      "Estado",
      "Categoría"
    ]);
    trialsDetailSheet.getRow(1).font = { bold: true };
    trialsDetailSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" }
    };
    trialsDetailSheet.getRow(1).font = { ...trialsDetailSheet.getRow(1).font, color: { argb: "FFFFFFFF" } };

    stats.trials.forEach((trial) => {
      trialsDetailSheet.addRow([
        trial.number || "",
        trial.typeTrial?.name || "",
        trial.plaintiff?.name || "",
        trial.defendant?.name || "",
        formatDate(trial.arrivalDate),
        trial.status || "",
        trial.category?.description || "N/A"
      ]);
    });
  }

  // Generar buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

