const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `ALTER TABLE "order"
      ADD COLUMN IF NOT EXISTS "cancelable" BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS "canceled" BOOLEAN NOT NULL DEFAULT FALSE;`
  );

  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION update_order_cancelable() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.shipment_status = 'processing' THEN
        NEW.cancelable = TRUE;
      ELSE
        NEW.cancelable = FALSE;
      END IF;
      RETURN NEW;
    END; $$ LANGUAGE plpgsql;`
  );

  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS "TRIGGER_ORDER_CANCELABLE"
    BEFORE UPDATE ON "order"
    FOR EACH ROW
    EXECUTE PROCEDURE update_order_cancelable();`
  );
};