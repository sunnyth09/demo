import * as RevenueService from "../../services/revenue.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ status: false, message: "Thiếu tham số startDate hoặc endDate" });
    }

    const data = await RevenueService.getRevenueAnalytics(startDate, endDate, type);
    
    res.status(200).json({
      status: true,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message || "Lỗi server khi lấy thống kê doanh thu"
    });
  }
};
