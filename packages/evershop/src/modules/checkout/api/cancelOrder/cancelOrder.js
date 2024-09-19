const { select, update } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const {
  INVALID_PAYLOAD,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  OK
} = require('@evershop/evershop/src/lib/util/httpStatus');
const { error } = require('@evershop/evershop/src/lib/log/logger');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const { order_id } = request.body;
    const order = await select()
      .from('order')
      .where('uuid', '=', order_id)
      .load(pool);

    if (!order) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: 'Invalid order'
        }
      });
    }

    const customer = request.getCurrentCustomer();
    if (!customer || customer.id !== order.customer_id) {
      response.status(UNAUTHORIZED);
      response.json({
        error: {
          status: UNAUTHORIZED,
          message: 'Unauthorized'
        }
      });
      return;
    }

    if (order.canceled) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: 'Order has been already canceled'
        }
      });
      return;
    }

    if (!order.cancelable) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: 'Order is not cancelable'
        }
      });
      return;
    }

    await update('order')
      .set('canceled', true)
      .where('uuid', '=', order_id)
      .execute(pool);

    // TODO: Refund

    response.status(OK);
  }
  catch (e) {
    error(e);
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      }
    });
  }
};