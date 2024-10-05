const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { select, update } = require('@evershop/postgres-query-builder');
const {
  INVALID_PAYLOAD,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  OK
} = require('@evershop/evershop/src/lib/util/httpStatus');
const { error } = require('@evershop/evershop/src/lib/log/logger');

module.exports = exports;

exports.cancelOrder = async (orderId, cartId, customer, restoreCart = false) => {
  try {
    const order = await select()
      .from('order')
      .where('uuid', '=', orderId)
      .load(pool);

    if (!order) {
      return {
        status: INVALID_PAYLOAD,
        message: 'Invalid order'
      };
    }

    if (!customer || customer.customer_id !== order.customer_id) {
      return {
        status: UNAUTHORIZED,
        message: 'Unauthorized'
      };
    }

    if (order.canceled) {
      return {
        status: INVALID_PAYLOAD,
        message: 'Order has been already canceled'
      };
    }

    if (!order.cancelable) {
      return {
        status: INVALID_PAYLOAD,
        message: 'Order is not cancelable'
      };
    }

    await update('order')
      .given({ 'canceled': true })
      .where('uuid', '=', orderId)
      .execute(pool);

    if (!cartId && restoreCart) {
      await update('cart')
        .given({ 'status': 1 })
        .where('cart_id', '=', order.cart_id)
        .execute(pool);
    }

    return {
      status: OK,
      message: 'Order canceled'
    };
  } catch (e) {
    error(e);
    return {
      status: INTERNAL_SERVER_ERROR,
      message: 'Internal server error'
    };
  }
};
