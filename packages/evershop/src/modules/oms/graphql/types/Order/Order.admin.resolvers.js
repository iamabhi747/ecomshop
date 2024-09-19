const { select } = require('@evershop/postgres-query-builder');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { getOrdersBaseQuery } = require('../../../services/getOrdersBaseQuery');
const { OrderCollection } = require('../../../services/OrderCollection');
const { getConfig } = require('../../../../../lib/util/getConfig');

module.exports = {
  Query: {
    orders: async (_, { filters = [] }, { user }) => {
      const query = getOrdersBaseQuery();
      
      // If user is super admin then show all orders
      // If user is store admin then show only orders that belong to the store
      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      if (!isSuperAdmin) {
        query.where('order.store_uuid', '=', user.store_uuid);
      }


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
