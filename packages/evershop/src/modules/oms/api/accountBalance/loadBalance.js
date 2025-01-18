const { select } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

const nullResponse = {
  balance: 0,
  currency: 'N/A'
};

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, deledate, next) => {
  const currentAdminUser = request.getCurrentUser();

  const query = select();
  query
    .from('store_info')
    .select('balance');

  if (currentAdminUser) {
    query.where('uuid', '=', currentAdminUser.store_uuid);
  }
  else {
    response.json(nullResponse);
    return;
  }

  const results = await query.execute(pool);
  if (results.length === 0) {
    response.json(nullResponse);
    return;
  }

  response.json({
    balance: results[0].balance,
    currency: getConfig('shop.currency', 'USD')
  });
};