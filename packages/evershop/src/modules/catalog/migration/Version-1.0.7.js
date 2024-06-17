const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {

    // add `admin_user_uuid` column to the `product` table
    await execute(
        connection,
        `ALTER TABLE product
            ADD COLUMN IF NOT EXISTS admin_user_uuid UUID NOT NULL DEFAULT 0`
    );
};