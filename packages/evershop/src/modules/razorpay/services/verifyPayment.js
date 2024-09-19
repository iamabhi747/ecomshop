const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { error } = require('@evershop/evershop/src/lib/log/logger');
const crypto = require('crypto');
const { getSetting } = require('../../../setting/services/setting');

module.exports = exports;

exports.verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const razorpayConfig = getConfig('system.razorpay', {});

    let razorpaySecretKey;
    if (razorpayConfig.secretKey) {
      razorpaySecretKey = razorpayConfig.secretKey;
    } else {
      razorpaySecretKey = await getSetting('razorpaySecretKey', '');
    }

    if (!razorpaySignature || !razorpayOrderId || !razorpayPaymentId || !razorpaySecretKey) {
      return false;
    }

    const sign = `${razorpayOrderId  }|${  razorpayPaymentId}`;
    const expectedSignature = crypto.createHmac('sha256', razorpaySecretKey).update(sign.toString()).digest('hex');

    return expectedSignature === razorpaySignature;
  } catch (e) {
    error(e);
    return false;
  }
};