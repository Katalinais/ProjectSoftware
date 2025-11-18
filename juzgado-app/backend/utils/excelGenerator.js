import ExcelJS from "exceljs";

export const generateStatisticsExcel = async (stats, startDate, endDate) => {
  const workbook = new ExcelJS.Workbook();
  
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const dateRange = `Del ${formatDate(startDate)} al ${formatDate(endDate)}`;

  const matrixSheet = workbook.addWorksheet("Matriz Categorías");
  
  const matrixData = stats.matrixData || {};
  const entryTypes = stats.entryTypes || [];
  const autoDescriptions = stats.autoDescriptions || [];

  matrixSheet.addRow(["REPORTE DE ESTADÍSTICAS - MATRIZ DE CATEGORÍAS"]);
  matrixSheet.addRow(["Período", dateRange]);
  matrixSheet.addRow([""]);
  
  const headerRow = ["Categoría"];
  
  entryTypes.forEach(entryType => {
    headerRow.push(entryType.description);
  });
  
  autoDescriptions.forEach(autoDesc => {
    headerRow.push(autoDesc.description);
  });
  
  headerRow.push("Total Sentencias");

  matrixSheet.addRow(headerRow);
  
  const titleRow = matrixSheet.getRow(1);
  titleRow.font = { bold: true, size: 14 };
  titleRow.alignment = { horizontal: "center" };
  
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
  
  const headerRowObj = matrixSheet.getRow(4);
  headerRowObj.font = { bold: true, size: 11 };
  headerRowObj.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" }
  };
  headerRowObj.font = { ...headerRowObj.font, color: { argb: "FFFFFFFF" } };
  headerRowObj.alignment = { horizontal: "center", vertical: "middle" };

  const sortedCategories = Object.values(matrixData).sort((a, b) => {
    if (a.typeTrialName === "Ordinario" && b.typeTrialName === "Ejecutivo") return -1;
    if (a.typeTrialName === "Ejecutivo" && b.typeTrialName === "Ordinario") return 1;
    return a.categoryName.localeCompare(b.categoryName);
  });

  sortedCategories.forEach(categoryData => {
    const categoryLabel = `${categoryData.typeTrialName} - ${categoryData.categoryName}`;
    const row = [categoryLabel];
    
    entryTypes.forEach(entryType => {
      row.push(categoryData.entryTypes[entryType.id] || 0);
    });
    
    autoDescriptions.forEach(autoDesc => {
      row.push(categoryData.autoDescriptions[autoDesc.id] || 0);
    });
    
    row.push(categoryData.totalSentencias || 0);
    
    matrixSheet.addRow(row);
  });
  
  matrixSheet.columns = [
    { width: 30 },
    ...Array(entryTypes.length).fill({ width: 20 }),
    ...Array(autoDescriptions.length).fill({ width: 25 }),
    { width: 18 }
  ];

  matrixSheet.views = [{
    state: "frozen",
    xSplit: 1,
    ySplit: 4,
    topLeftCell: "B5",
    activeCell: "B5"
  }];

  const tutelaMatrixSheet = workbook.addWorksheet("Matriz Tutela");
  const tutelaMatrixData = stats.tutelaMatrixData || {};
  const tutelaCategories = stats.tutelaCategories || [];
  const tutelaEntryTypes = stats.tutelaEntryTypes || [];
  const tutelaAutoDescriptions = stats.tutelaAutoDescriptions || [];
  const tutelaSentenciaDescriptions = stats.tutelaSentenciaDescriptions || [];

  tutelaMatrixSheet.addRow(["REPORTE DE ESTADÍSTICAS - MATRIZ DE TUTELA"]);
  tutelaMatrixSheet.addRow(["Período", dateRange]);
  tutelaMatrixSheet.addRow([""]);

  // Fila de encabezados de grupo
  const tutelaGroupHeaderRow = [""];
  if (tutelaEntryTypes.length > 0) {
    tutelaGroupHeaderRow.push("TIPOS DE ENTRADA");
    for (let i = 1; i < tutelaEntryTypes.length; i++) {
      tutelaGroupHeaderRow.push("");
    }
  }
  if (tutelaAutoDescriptions.length > 0) {
    tutelaGroupHeaderRow.push("DESCRIPCIONES DE AUTO");
    for (let i = 1; i < tutelaAutoDescriptions.length; i++) {
      tutelaGroupHeaderRow.push("");
    }
  }
  if (tutelaSentenciaDescriptions.length > 0) {
    tutelaGroupHeaderRow.push("DESCRIPCIONES DE SENTENCIA");
    for (let i = 1; i < tutelaSentenciaDescriptions.length; i++) {
      tutelaGroupHeaderRow.push("");
    }
  }
  tutelaMatrixSheet.addRow(tutelaGroupHeaderRow);

  // Fila de encabezados de columnas
  const tutelaHeaderRow = ["Categoría"];
  
  tutelaEntryTypes.forEach(entryType => {
    tutelaHeaderRow.push(entryType.description);
  });
  
  tutelaAutoDescriptions.forEach(autoDesc => {
    tutelaHeaderRow.push(autoDesc.description);
  });
  
  tutelaSentenciaDescriptions.forEach(sentenciaDesc => {
    tutelaHeaderRow.push(sentenciaDesc.description);
  });

  tutelaMatrixSheet.addRow(tutelaHeaderRow);

  const tutelaTitleRow = tutelaMatrixSheet.getRow(1);
  tutelaTitleRow.font = { bold: true, size: 14 };
  tutelaTitleRow.alignment = { horizontal: "center" };
  const tutelaLastColumn = getColumnLetter(tutelaHeaderRow.length);
  tutelaMatrixSheet.mergeCells(`A1:${tutelaLastColumn}1`);

  // Estilo para la fila de encabezados de grupo (fila 4)
  const tutelaGroupHeaderRowObj = tutelaMatrixSheet.getRow(4);
  tutelaGroupHeaderRowObj.font = { bold: true, size: 11 };
  tutelaGroupHeaderRowObj.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE7E6E6" }
  };
  tutelaGroupHeaderRowObj.alignment = { horizontal: "center", vertical: "middle" };

  // Fusionar celdas para los encabezados de grupo
  let currentCol = 2; // Empezar en columna B (después de "Categoría")
  if (tutelaEntryTypes.length > 0) {
    const startCol = getColumnLetter(currentCol);
    currentCol += tutelaEntryTypes.length;
    const endCol = getColumnLetter(currentCol - 1);
    tutelaMatrixSheet.mergeCells(`${startCol}4:${endCol}4`);
  }
  if (tutelaAutoDescriptions.length > 0) {
    const startCol = getColumnLetter(currentCol);
    currentCol += tutelaAutoDescriptions.length;
    const endCol = getColumnLetter(currentCol - 1);
    tutelaMatrixSheet.mergeCells(`${startCol}4:${endCol}4`);
  }
  if (tutelaSentenciaDescriptions.length > 0) {
    const startCol = getColumnLetter(currentCol);
    currentCol += tutelaSentenciaDescriptions.length;
    const endCol = getColumnLetter(currentCol - 1);
    tutelaMatrixSheet.mergeCells(`${startCol}4:${endCol}4`);
  }

  // Estilo para la fila de encabezados de columnas (fila 5)
  const tutelaHeaderRowObj = tutelaMatrixSheet.getRow(5);
  tutelaHeaderRowObj.font = { bold: true, size: 11 };
  tutelaHeaderRowObj.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" }
  };
  tutelaHeaderRowObj.font = { ...tutelaHeaderRowObj.font, color: { argb: "FFFFFFFF" } };
  tutelaHeaderRowObj.alignment = { horizontal: "center", vertical: "middle" };

  tutelaCategories.forEach(category => {
    const categoryData = tutelaMatrixData[category.id];
    if (categoryData) {
      const row = [category.description];
      
      tutelaEntryTypes.forEach(entryType => {
        row.push(categoryData.entryTypes[entryType.id] || 0);
      });
      
      tutelaAutoDescriptions.forEach(autoDesc => {
        row.push(categoryData.autoDescriptions[autoDesc.id] || 0);
      });
      
      tutelaSentenciaDescriptions.forEach(sentenciaDesc => {
        row.push(categoryData.sentenciaDescriptions[sentenciaDesc.id] || 0);
      });
      
      tutelaMatrixSheet.addRow(row);
    }
  });

  tutelaMatrixSheet.columns = [
    { width: 30 },
    ...Array(tutelaEntryTypes.length).fill({ width: 20 }),
    ...Array(tutelaAutoDescriptions.length).fill({ width: 25 }),
    ...Array(tutelaSentenciaDescriptions.length).fill({ width: 25 })
  ];

  tutelaMatrixSheet.views = [{
    state: "frozen",
    xSplit: 1,
    ySplit: 5,
    topLeftCell: "B6",
    activeCell: "B6"
  }];

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

  summarySheet.getRow(1).font = { bold: true, size: 16 };
  summarySheet.getRow(4).font = { bold: true, size: 12 };
  summarySheet.getRow(1).alignment = { horizontal: "center" };
  summarySheet.mergeCells("A1:B1");

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

    const totalRow = trialsSheet.addRow(["TOTAL", stats.totalTrials || 0]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" }
    };
  }

  // Hoja 5: Personas por Tipo de Documento
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

    const totalRow = peopleSheet.addRow(["TOTAL", stats.totalPeople || 0]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2EFDA" }
    };
  }

  // Hoja 6: Actuaciones por Tipo
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


    const totalRow = actionsSheet.addRow(["TOTAL", stats.totalActions || 0]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE7D9F2" }
    };
  }

  // Hoja 7: Detalle de Procesos
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

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

