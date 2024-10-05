const { OK } = require('@evershop/evershop/src/lib/util/httpStatus');
const { getContextValue } = require('../../../graphql/services/contextHelper');
const { cancelOrder } = require('../../services/cancelOrder');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const { order_id } = request.body;
  const restoreCart = request.body.restoreCart || false;
  const currentCart = getContextValue(request, 'cartId');
  const customer = request.getCurrentCustomer();

  const result = await cancelOrder(order_id, currentCart, customer, restoreCart);

  response.status(result.status);
  if (result.status !== OK) {
    response.json({
      error: {
        status: result.status,
        message: result.message
      }
    });
  }
  else {
    response.json({
      success: true,
      message: result.message
    });
  }

};