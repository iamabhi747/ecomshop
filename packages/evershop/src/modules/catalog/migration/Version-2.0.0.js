const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
    await execute(
        connection,
        `ALTER TABLE "product"
          ADD COLUMN IF NOT EXISTS "store_uuid" UUID NOT NULL DEFAULT '5305318d-b01e-48f5-b564-7dff294c9b53',
          ADD CONSTRAINT "STORE_UUID" FOREIGN KEY ("store_uuid") REFERENCES "store_info" ("uuid")`
    );
};