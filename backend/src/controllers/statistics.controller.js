import * as StatisticsService from "../services/statistics.service.js";

export const getStatistics = async (req, res) => {
  try {
    const statistics = await StatisticsService.getStatistics();
    res.status(200).json({
      status: true,
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
