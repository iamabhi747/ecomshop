const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS "reset_password_admin_token" (
            "reset_password_token_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
            "admin_user_id" INT NOT NULL,
            "token" TEXT NOT NULL,
            "created_at" timestamp with time zone NOT NULL DEFAULT now()
        );`
    );
};