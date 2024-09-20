const { execute } = require('@evershop/postgres-query-builder');

module.exports = exports = async (connection) => {
  await execute(
    connection,
    `ALTER TABLE "reset_password_admin_token" DROP CONSTRAINT IF EXISTS "FK_RESET_PASSWORD_TOKEN_ADMIN"`
  );
  await execute(
    connection,
    `ALTER TABLE "reset_password_admin_token"
      ADD CONSTRAINT "FK_RESET_PASSWORD_TOKEN_ADMIN" FOREIGN KEY ("admin_user_id") REFERENCES "admin_user" ("admin_user_id") ON DELETE CASCADE
    `
  );
};