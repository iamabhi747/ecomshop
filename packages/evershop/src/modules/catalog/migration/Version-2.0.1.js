const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(connection, 
  `CREATE TABLE "product_comment" (
    "comment_id" SERIAL PRIMARY KEY,
    "product_id" INT NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "comment" TEXT DEFAULT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT "FK_PRODUCT_COMMENT" FOREIGN KEY ("product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE
  );`
  );
};