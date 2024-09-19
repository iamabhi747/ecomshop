const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Setting: {
    razorpayPaymentStatus: (setting) => {
      const razorpayConfig = getConfig('system.razorpay', {});
      if (razorpayConfig.status) {
        return razorpayConfig.status;
      }
      const razorpayPaymentStatus = setting.find(
        (s) => s.name === 'razorpayPaymentStatus'
      );
      if (razorpayPaymentStatus) {
        return parseInt(razorpayPaymentStatus.value, 10);
      } else {
        return 0;
      }
    },
    razorpayDislayName: (setting) => {
      const razorpayDislayName = setting.find(
        (s) => s.name === 'razorpayDislayName'
      );
      if (razorpayDislayName) {
        return razorpayDislayName.value;
      } else {
        return 'Razorpay';
      }
    },
    razorpayKeyId: (setting) => {
      const razorpayConfig = getConfig('system.razorpay', {});
      if (razorpayConfig.keyId) {
        return razorpayConfig.keyId;
      }
      const razorpayKeyId = setting.find(
        (s) => s.name === 'razorpayKeyId'
      );
      if (razorpayKeyId) {
        return razorpayKeyId.value;
      } else {
        return null;
      }
    }
  }
};
