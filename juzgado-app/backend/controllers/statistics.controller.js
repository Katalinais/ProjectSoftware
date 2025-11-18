import { getStatisticsService } from "../services/statistics.service.js";
import { generateStatisticsExcel } from "../utils/excelGenerator.js";

export const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const statistics = await getStatisticsService(startDate, endDate);
    res.json(statistics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Las fechas de inicio y fin son requeridas" 
      });
    }

    const statistics = await getStatisticsService(startDate, endDate);

    const excelBuffer = await generateStatisticsExcel(
      statistics,
      new Date(startDate),
      new Date(endDate)
    );

    const fileName = `reporte_estadisticas_${startDate}_${endDate}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );

    res.send(excelBuffer);
  } catch (err) {
    console.error("Error al generar reporte:", err);
    res.status(500).json({ message: err.message || "Error al generar el reporte" });
  }
};

