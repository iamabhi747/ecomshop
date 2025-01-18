const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION add_money_to_store_on_order_complition() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.shipment_status = 'delivered' AND NEW.payment_status = 'paid' THEN
        UPDATE "store_info" SET balance = balance + NEW.grand_total WHERE uuid = NEW.store_uuid;
      END IF;
      RETURN NEW;
    END; $$ LANGUAGE plpgsql;`
  );

  await execute(
    connection,
    `DROP TRIGGER IF EXISTS "TRIGGER_ORDER_CANCELABLE" ON "order";`
  );

  await execute(
    connection,
    `CREATE TRIGGER "TRIGGER_ORDER_ADD_MONEY_TO_STORE"
    AFTER UPDATE ON "order"
    FOR EACH ROW
    EXECUTE PROCEDURE add_money_to_store_on_order_complition();`
  );
};