const {
  startTransaction,
  commit,
  rollback,
  insert,
  select,
  update
} = require('@evershop/postgres-query-builder');
const {
  getConnection
} = require('@evershop/evershop/src/lib/postgres/connection');


async function validateClaimAmount(currentAdminUser, amount, connection) {
  const result = await select('balance').from('store_info').where('uuid', '=', currentAdminUser.store_uuid).execute(connection);
  if (result.length === 0) {
    throw new Error('Something Went Wrong!');
  }
  const {balance} = result[0];

  if (amount <= 0 || amount > balance) {
    throw new Error('Invalid Claim, Insufficient balance');
  }

  return balance - amount;
}

module.exports = async (data, context) => {
  // Make sure the context is either not provided or is an object
  if (context && typeof context !== 'object') {
    throw new Error('Context must be an object');
  }
  if (!context?.currentAdminUser || !context.currentAdminUser.store_uuid) {
    throw new Error('Unauthorized, need admin user');
  }
  if (!data?.amount) {
    throw new Error('Invalid Payload');
  }

  const {amount} = data;
  const {store_uuid} = context.currentAdminUser;

  const connection = await getConnection();
  
  await startTransaction(connection);
  try {

    const updatedBalance = await validateClaimAmount(context.currentAdminUser, amount, connection);

    const claim = await insert('admin_claims').given({
      store_uuid,
      amount
    }).execute(connection);

    await update('store_info').given({ balance: updatedBalance }).where('uuid', '=', store_uuid).execute(connection);
    
    await commit(connection);
    return claim;
  }
  catch (e) {
    await rollback(connection);
    throw e;
  }
};