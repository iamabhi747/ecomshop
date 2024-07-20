const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
    await execute(
        connection,
        `ALTER TABLE "product"
          ADD COLUMN IF NOT EXISTS "store_uuid" UUID NOT NULL DEFAULT '1270804a-9062-4bec-84d4-9454c60fedbf',
          ADD CONSTRAINT "STORE_UUID" FOREIGN KEY ("store_uuid") REFERENCES "store_info" ("uuid")`
    );
};