const { select } = require('@evershop/postgres-query-builder');
const dayjs = require('dayjs');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, stack, next) => {
  const currentAdminUser = request.getCurrentUser();
  const isSuperAdmin = request.isSuperAdmin();

  response.$body = [];
  const { period = 'weekly' } = request.query;
  let i = 5;
  const result = [];
  const today = dayjs().format('YYYY-MM-DD').toString();
  while (i >= 0) {
    result[i] = {};

    if (period === 'daily') {
      result[i].from = `${dayjs(today)
        .subtract(5 - i, 'day')
        .format('YYYY-MM-DD')
        .toString()} 00:00:00`;
      result[i].to = `${dayjs(today)
        .subtract(5 - i, 'day')
        .format('YYYY-MM-DD')
        .toString()} 23:59:59`;
    }
    if (period === 'weekly') {
      result[i].from = `${dayjs(today)
        .subtract(5 - i, 'week')
        .startOf('week')
        .format('YYYY-MM-DD')
        .toString()} 00:00:00`;
      result[i].to = `${dayjs(today)
        .subtract(5 - i, 'week')
        .endOf('week')
        .format('YYYY-MM-DD')
        .toString()} 23:59:59`;
    }
    if (period === 'monthly') {
      result[i].from = `${dayjs(today)
        .subtract(5 - i, 'month')
        .startOf('month')
        .format('YYYY-MM-DD')
        .toString()} 00:00:00`;
      result[i].to = `${dayjs(today)
        .subtract(5 - i, 'month')
        .endOf('month')
        .format('YYYY-MM-DD')
        .toString()} 23:59:59`;
    }
    i -= 1;
  }
  const results = await Promise.all(
    result.map(async (element) => {
      const query = select();
      query
        .from('order')
        .select('SUM (grand_total)', 'total')
        .select('COUNT (order_id)', 'count')
        .where('created_at', '>=', element.from)
        .and('created_at', '<=', element.to);
      
      // If user is super admin then show sales for all orders
      // If user is store admin then show sales for only orders that belong to the store
      if (currentAdminUser && !isSuperAdmin) {
        query.andWhere('store_uuid', '=', currentAdminUser.store_uuid);
      }

      query.limit(0, 1);
      const queryResult = await query.execute(pool);
      return {
        total: queryResult[0].total || 0,
        count: queryResult[0].count,
        time: dayjs(element.to).format('MMM DD').toString()
      };
    })
  );
  response.json(results);
};
