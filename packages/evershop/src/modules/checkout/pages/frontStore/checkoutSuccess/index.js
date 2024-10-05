const { select } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const {
  setContextValue,
  getContextValue
} = require('../../../../graphql/services/contextHelper');
const { cancelOrder } = require('../../../services/cancelOrder');

module.exports = async (request, response, stack, next) => {
  const { orderId } = request.params;
  const query = select().from('order');
  query.where('uuid', '=', orderId);
  const order = await query.load(pool);
  if (!order) {
    response.redirect(302, buildUrl('homepage'));
  } else {

    const currentCartId = getContextValue(request, 'cartId');
    const customer = request.getCurrentCustomer();

    if (order.payment_method !== 'cod' && order.payment_status === 'pending') {
      await cancelOrder(orderId, currentCartId, customer, true);
      response.redirect(buildUrl('cart'));
    }

    setContextValue(request, 'orderId', orderId);
    setContextValue(request, 'pageInfo', {
      title: 'Checkout success',
      description: 'Checkout success'
    });
    next();
  }
};
