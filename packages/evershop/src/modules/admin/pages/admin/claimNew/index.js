const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');
const { getSetting } = require('../../../../setting/services/setting');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const storeCommission = await getSetting('storeCommission', 0);
  
  setContextValue(request, 'storeCurrency', getConfig('shop.currency', 'USD'));
  setContextValue(request, 'cutPercentage', storeCommission);

  setContextValue(request, 'pageInfo', {
    title: 'Create a new claim',
    description: 'Create a new claim'
  });
  next();
};
