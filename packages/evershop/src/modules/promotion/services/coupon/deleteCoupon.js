const { hookable } = require('@evershop/evershop/src/lib/util/hookable');
const {
  startTransaction,
  commit,
  rollback,
  select,
  del
} = require('@evershop/postgres-query-builder');
const {
  getConnection
} = require('@evershop/evershop/src/lib/postgres/connection');

async function deleteCouponData(uuid, connection) {
  await del('coupon').where('uuid', '=', uuid).execute(connection);
}

/**
 * Delete coupon service. This service will delete a coupon with all related data
 * @param {String} uuid
 * @param {Object} context
 */
async function deleteCoupon(uuid, store_uuid, context, force) {
  const connection = await getConnection();
  await startTransaction(connection);
  try {
    const query = select().from('coupon').where('uuid', '=', uuid);

    if (!force) {
      query.andWhere('store_uuid', '=', store_uuid);
    }
    
    const coupon = await query.load(connection);

    if (!coupon) {
      throw new Error('Invalid coupon id');
    }
    await hookable(deleteCouponData, { ...context, coupon, connection })(
      uuid,
      connection
    );
    await commit(connection);
    return coupon;
  } catch (e) {
    await rollback(connection);
    throw e;
  }
}

module.exports = async (uuid, store_uuid, context, force = false) => {
  // Make sure the context is either not provided or is an object
  if (context && typeof context !== 'object') {
    throw new Error('Context must be an object');
  }
  const coupon = await hookable(deleteCoupon, context)(uuid, store_uuid, context, force);
  return coupon;
};
