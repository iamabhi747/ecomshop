const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
    await execute(
        connection,
        `ALTER TABLE "admin_user"
        ADD IF NOT EXISTS "store_uuid" UUID ,
        ADD IF NOT EXISTS "phone" varchar NOT NULL DEFAULT '1234567890';`
    );
    // ADD CONSTRAINT "STORE_UUID" FOREIGN KEY ("store_uuid") REFERENCES "store_info" ("uuid");
};