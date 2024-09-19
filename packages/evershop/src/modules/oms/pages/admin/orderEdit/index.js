const { select } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

module.exports = async (request, response, delegate, next) => {
  try {
    const query = select();
    query.from('order');
    query.andWhere('order.uuid', '=', request.params.id);

    // If user is seller admin then only show orders that belong to that seller
    // If user is super admin then show all orders
    const currentAdminUser = request.getCurrentUser();
    const isSuperAdmin = request.isSuperAdmin();
    if (currentAdminUser && !isSuperAdmin) {
      query.andWhere('order.store_uuid', '=', currentAdminUser.store_uuid);
    } else if (!isSuperAdmin) {
      response.status(404);
      next();
      return;
    }

    const order = await query.load(pool);

    if (order === null) {
      response.status(404);
      next();
    } else {
      setContextValue(request, 'orderId', order.uuid);
      setContextValue(request, 'orderCurrency', order.currency);
      setContextValue(request, 'pageInfo', {
        title: `Order #${order.order_number}`,
        description: `Order #${order.order_number}`
      });
      next();
    }
  } catch (e) {
    next(e);
  }
};
