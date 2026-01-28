import { Order, sequelize } from "../models/sequelize/index.js";
import { Op } from "sequelize";

export const getRevenueAnalytics = async (startDate, endDate, type = 'daily') => {
  // Ensure dates are valid Date objects
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // 1. Overall Stats in Range
  const totalRevenue = await Order.sum('total_amount', {
    where: {
      status: 'completed',
      createdAt: { [Op.between]: [start, end] }
    }
  }) || 0;

  const totalOrders = await Order.count({
    where: {
      status: { [Op.ne]: 'cancelled' }, // Count all non-cancelled orders
      createdAt: { [Op.between]: [start, end] }
    }
  });

  const completedOrders = await Order.count({
    where: {
      status: 'completed',
      createdAt: { [Op.between]: [start, end] }
    }
  });

  const cancelledOrders = await Order.count({
    where: {
      status: 'cancelled',
      createdAt: { [Op.between]: [start, end] }
    }
  });

  // Calculate Average Order Value (AOV)
  const aov = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;
  
  // Calculate Completion Rate
  const totalAttempts = completedOrders + cancelledOrders;
  const completionRate = totalAttempts > 0 
    ? Math.round((completedOrders / totalAttempts) * 100) 
    : 0;

  // 2. Chart Data (Time Series)
  // Determine grouping format based on type
  // For MySQL: DATE_FORMAT(createdAt, '%Y-%m-%d') for daily
  // For SQLite (often used in dev) it's distinct. 
  // IMPORTANT: The user's stack is Sequelize + MySQL/Postgres usually in these templates.
  // I will use JavaScript-based aggregation for database agnostic support if the dataset isn't huge,
  // but for analytics, SQL grouping is better. However, to stay safe and quick without knowing DB dialect perfectly (likely MySQL),
  // I'll fetch raw data and map it in JS. It's safer for "small-medium" scale.
  
  const orders = await Order.findAll({
    where: {
      createdAt: { [Op.between]: [start, end] }
    },
    attributes: ['id', 'total_amount', 'status', 'createdAt'],
    order: [['createdAt', 'ASC']]
  });

  // Grouping logic
  const chartMap = new Map();
  // Fill empty dates? 
  // Let's create a date range loop to ensure x-axis continuity
  const dateLoop = new Date(start);
  while (dateLoop <= end) {
    const key = dateLoop.toISOString().split('T')[0]; // YYYY-MM-DD
    chartMap.set(key, {
      date: key,
      label: `${dateLoop.getDate()}/${dateLoop.getMonth() + 1}`,
      revenue: 0,
      orders: 0,
      cancelled: 0
    });
    dateLoop.setDate(dateLoop.getDate() + 1);
  }

  orders.forEach(order => {
    const dateKey = order.createdAt.toISOString().split('T')[0];
    if (chartMap.has(dateKey)) {
      const entry = chartMap.get(dateKey);
      if (order.status === 'completed') {
        entry.revenue += order.total_amount;
      }
      
      if (order.status === 'cancelled') {
        entry.cancelled += 1;
      } else {
         // Count valid orders (completed, shipping, pending, etc)
         entry.orders += 1;
      }
    }
  });

  return {
    summary: {
      totalRevenue,
      totalOrders,
      aov,
      completionRate,
      cancelledOrders
    },
    chartData: Array.from(chartMap.values())
  };
};
