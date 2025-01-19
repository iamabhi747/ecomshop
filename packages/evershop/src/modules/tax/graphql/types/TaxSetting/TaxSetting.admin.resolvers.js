module.exports = {
  Setting: {
    defaultProductTaxClassId: (setting) => {
      const defaultProductTaxClassId = setting.find(
        (s) => s.name === 'defaultProductTaxClassId'
      );
      if (defaultProductTaxClassId && defaultProductTaxClassId.value) {
        return defaultProductTaxClassId.value;
      } else {
        return null;
      }
    },
    defaultShippingTaxClassId: (setting) => {
      const defaultShippingTaxClassId = setting.find(
        (s) => s.name === 'defaultShippingTaxClassId'
      );
      if (defaultShippingTaxClassId && defaultShippingTaxClassId.value) {
        return defaultShippingTaxClassId.value;
      } else {
        return null;
      }
    },
    baseCalculationAddress: (setting) => {
      const baseCalculationAddress = setting.find(
        (s) => s.name === 'baseCalculationAddress'
      );
      if (baseCalculationAddress && baseCalculationAddress.value) {
        return baseCalculationAddress.value;
      } else {
        return null;
      }
    },
    storeCommission: (setting) => {
      const storeCommission = setting.find(
        (s) => s.name === 'storeCommission'
      );
      if (storeCommission && storeCommission.value) {
        return storeCommission.value;
      } else {
        return 0;
      }
    }
  }
};
