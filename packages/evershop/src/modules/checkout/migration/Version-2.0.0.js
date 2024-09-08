const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
    await execute(connection,
        `CREATE OR REPLACE FUNCTION default_store_uuid() 
          RETURNS UUID LANGUAGE SQL AS $$
            SELECT "uuid" FROM "store_info" LIMIT 1;
        $$;`
    );
    await execute(connection,
        `ALTER TABLE "order"
          ADD COLUMN IF NOT EXISTS "store_uuid" UUID NOT NULL DEFAULT default_store_uuid();`
    );
};