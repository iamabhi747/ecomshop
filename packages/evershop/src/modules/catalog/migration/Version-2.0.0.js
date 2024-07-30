const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
    await execute(
        connection,
        `ALTER TABLE "product"
          ADD COLUMN IF NOT EXISTS "store_uuid" UUID NOT NULL DEFAULT '97627b9a-46d2-4f7a-853e-e42b1c646e62',
          ADD CONSTRAINT "STORE_UUID" FOREIGN KEY ("store_uuid") REFERENCES "store_info" ("uuid")`
    );
};