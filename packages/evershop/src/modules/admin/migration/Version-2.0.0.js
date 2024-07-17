const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS "store_info" (
        "id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
        "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
        "name" varchar NOT NULL,
        "description" text DEFAULT NULL,
        "status" boolean NOT NULL DEFAULT TRUE,
        "phone" varchar NOT NULL,
        "email" varchar NOT NULL,
        "address_uuid" UUID NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "STORE_EMAIL_UNIQUE" UNIQUE ("email"),
        CONSTRAINT "STORE_PHONE_UNIQUE" UNIQUE ("phone"),
        CONSTRAINT "STORE_UUID_UNIQUE" UNIQUE ("uuid")
        );`
    );
};