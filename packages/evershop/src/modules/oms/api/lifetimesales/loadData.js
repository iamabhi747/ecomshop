const { select } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

/* eslint-disable no-unused-vars */
module.exports = async function lifetimeSales(
  request,
  response,
  delegate,
  next
) {
  const currentAdminUser = request.getCurrentUser();
  const isSuperAdmin = request.isSuperAdmin();

  const query = select();
  query
    .from('order')
    .select('grand_total', 'total')
    .select('payment_status')
    .select('shipment_status')
    .select('canceled');

  // If user is super admin then show lifetime sales for all orders
  // If user is store admin then show lifetime sales for only orders that belong to the store
  if (currentAdminUser && !isSuperAdmin) {
    query.where('store_uuid', '=', currentAdminUser.store_uuid);
  } else if (!currentAdminUser) {
    response.json({
      orders: 0,
      total: 0,
      completed_percentage: 0,
      cancelled_percentage: 0
    });
    return;
  }

  const results = await query.execute(pool);

  let total = 0;
  let cancelled = 0;
  let completed = 0;
  results.forEach((result) => {
    total += parseFloat(result.total);
    if (
      result.payment_status === 'paid' &&
      result.shipment_status === 'delivered'
    ) {
      completed += 1;
    }
    if (
      result.canceled === true
    ) {
      cancelled += 1;
    }
  });
  const currency = getConfig('shop.currency', 'USD');
  const language = getConfig('shop.language', 'en');
  const formatedTotal = new Intl.NumberFormat(language, {
    style: 'currency',
    currency
  }).format(total);

  response.json({
    orders: results.length,
    total: formatedTotal,
    completed_percentage:
      results.length === 0 ? 0 : Math.round((completed / results.length) * 100),
    cancelled_percentage:
      results.length === 0 ? 0 : Math.round((cancelled / results.length) * 100)
  });
};
