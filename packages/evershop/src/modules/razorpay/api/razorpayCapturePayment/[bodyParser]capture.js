const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const {
  OK,
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD
} = require('@evershop/evershop/src/lib/util/httpStatus');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { select, update, insert } = require('@evershop/postgres-query-builder');
const { getSetting } = require('../../../setting/services/setting');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const razorpayConfig = getConfig('system.razorpay', {});

    let razorpayWebhookSecret;
    if (razorpayConfig.webhookSecret) {
      razorpayWebhookSecret = razorpayConfig.webhookSecret;
    } else {
      razorpayWebhookSecret = await getSetting('razorpayWebhookSecret', '');
    }

    const valid = validateWebhookSignature(
      JSON.stringify(request.body),
      request.headers['x-razorpay-signature'],
      razorpayWebhookSecret
    );
    if (!valid) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: 'Invalid signature'
        }
      });
      return;
    }

    const razorpayOrder = request.body.payload.order.entity;
    const razorpayPayment = request.body.payload.payment.entity;
    const orderId = razorpayOrder.notes?.orderId;

    // check if the order exists
    const order = await select()
      .from('order')
      .where('uuid', '=', orderId)
      .and('payment_method', '=', 'Razorpay')
      .and('payment_status', '=', 'pending')
      .load(pool);

    if (!order) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message:
            'Requested order does not exist or is not in pending payment status'
        }
      });
      return;
    }

    // Update order status to paid
    await update('order')
      .given({ payment_status: 'paid' })
      .where('uuid', '=', orderId)
      .execute(pool);

    // Add transaction data to database
    await insert('payment_transaction')
      .given({
        payment_transaction_order_id: orderId,
        transaction_id: razorpayPayment.id,
        transaction_type: razorpayPayment.method,
        amount: razorpayPayment.amount,
        payment_action: 'capture',
        additional_information: JSON.stringify(razorpayPayment),
        currency: razorpayPayment.currency
      })
      .execute(pool);

    response.status(OK);
    response.json({
      message: 'Payment captured'
    });
  } catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message
      }
    });
  }
};