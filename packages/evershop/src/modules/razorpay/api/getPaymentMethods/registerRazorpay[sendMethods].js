const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('../../../setting/services/setting');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response) => {
  // Check if razorpay is enabled
  const razorpayConfig = getConfig('system.razorpay', {});
  let razorpayStatus;
  if (razorpayConfig.status) {
    razorpayStatus = razorpayConfig.status;
  } else {
    razorpayStatus = await getSetting('razorpayPaymentStatus', 0);
  }
  if (parseInt(razorpayStatus, 10) === 1) {
    return {
      methodCode: 'Razorpay',
      methodName: await getSetting('razorpayDislayName', 'Razorpay')
    };
  } else {
    return null;
  }
};
