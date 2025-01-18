const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
    await execute(
        connection,
        `ALTER TABLE "store_info"
          ADD COLUMN IF NOT EXISTS "balance" decimal(12,4) NOT NULL DEFAULT 0;
        `
    );
};