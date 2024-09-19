const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
    await execute(
        connection,
        `ALTER TABLE "coupon"
          ADD COLUMN "store_uuid" UUID DEFAULT default_store_uuid() NOT NULL;`
    );
};