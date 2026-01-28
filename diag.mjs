import { Order, sequelize } from './backend/src/models/sequelize/index.js';

async function check() {
  try {
    const allStatuses = await Order.findAll({
      attributes: ['status', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['status']
    });
    console.log('Statuses in DB:', JSON.stringify(allStatuses, null, 2));

    const completedTotal = await Order.sum('total_amount', { where: { status: 'completed' } });
    console.log('Total Revenue (completed):', completedTotal);
    
    const hoanThanhTotal = await Order.sum('total_amount', { where: { status: 'Hoàn thành' } });
    console.log('Total Revenue (Hoàn thành):', hoanThanhTotal);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
