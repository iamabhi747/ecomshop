const { select } = require('@evershop/postgres-query-builder');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { getOrdersBaseQuery } = require('../../../services/getOrdersBaseQuery');
const { OrderCollection } = require('../../../services/OrderCollection');

module.exports = {
  Query: {
    orders: async (_, { filters = [] }, { user }) => {
      const query = getOrdersBaseQuery();

      // Only show orders that belong to the current admin's store
      query.where('order.store_uuid', '=', user.store_uuid);

      const root = new OrderCollection(query);
      await root.init(filters);
      return root;
    }
  },
  Order: {
    editUrl: ({ uuid }) => buildUrl('orderEdit', { id: uuid }),
    createShipmentApi: ({ uuid }) => buildUrl('createShipment', { id: uuid }),
    customerUrl: async ({ customerId }, _, { pool }) => {
      const customer = await select()
        .from('customer')
        .where('customer_id', '=', customerId)
        .load(pool);
      return customer ? buildUrl('customerEdit', { id: customer.uuid }) : null;
    }
  },
  Shipment: {
    updateShipmentApi: ({ orderUuid, uuid }) =>
      buildUrl('updateShipment', { order_id: orderUuid, shipment_id: uuid })
  }
};
