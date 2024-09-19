const { select } = require('@evershop/postgres-query-builder');
const smallestUnit = require('zero-decimal-currencies');
const Razorpay = require('razorpay');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const {
  OK,
  INVALID_PAYLOAD
} = require('@evershop/evershop/src/lib/util/httpStatus');
const { getSetting } = require('../../../setting/services/setting');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  // eslint-disable-next-line camelcase
  const { order_id } = request.body;
  // Check the order
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
  } else {
    const razorpayConfig = getConfig('system.razorpay', {});

    let razorpaySecretKey;
    if (razorpayConfig.secretKey) {
      razorpaySecretKey = razorpayConfig.secretKey;
    } else {
      razorpaySecretKey = await getSetting('razorpaySecretKey', '');
    }

    let razorpayKeyId;
    if (razorpayConfig.keyId) {
      razorpayKeyId = razorpayConfig.keyId;
    } else {
      razorpayKeyId = await getSetting('razorpayKeyId', '');
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecretKey
    });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await razorpay.orders.create({
      amount: smallestUnit.default(order.grand_total, order.currency),
      currency: order.currency,
      receipt: `receipt#${  Math.random().toString(36).substring(7)}`,
      notes: {
        // eslint-disable-next-line camelcase
        orderId: order_id
      },
      partial_payment: false
    });

    response.status(OK);
    response.json({
      data: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });
  }
};
