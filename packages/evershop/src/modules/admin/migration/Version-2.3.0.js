const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS "admin_claims" (
            "id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
            "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
            "store_uuid" UUID NOT NULL,
            "amount" decimal(12, 4) NOT NULL DEFAULT 0,
            "status" varchar NOT NULL DEFAULT 'pending',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "ADMIN_CLAIMS_UUID_UNIQUE" UNIQUE ("uuid")
        );`
    );
};