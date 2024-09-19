const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Setting: {
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
    },
    razorpaySecretKey: (setting, _, { user }) => {
      const razorpayConfig = getConfig('system.razorpay', {});
      if (razorpayConfig.secretKey) {
        return `${razorpayConfig.secretKey.substr(
          0,
          5
        )}*******************************`;
      }
      if (user) {
        const razorpaySecretKey = setting.find(
          (s) => s.name === 'razorpaySecretKey'
        );
        if (razorpaySecretKey) {
          return razorpaySecretKey.value;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    razorpayEndpointSecret: (setting, _, { user }) => {
      const razorpayConfig = getConfig('system.razorpay', {});
      if (razorpayConfig.endpointSecret) {
        return `${razorpayConfig.endpointSecret.substr(
          0,
          5
        )}*******************************`;
      }
      if (user) {
        const razorpayEndpointSecret = setting.find(
          (s) => s.name === 'razorpayEndpointSecret'
        );
        if (razorpayEndpointSecret) {
          return razorpayEndpointSecret.value;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }
};
