const { select } = require('@evershop/postgres-query-builder');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');

module.exports = {
    Query: {
        store: async (root, { id }, { pool }) => {
            const query = select().from('store_info');
            query.where('uuid', '=', id);
            query.andWhere('status', '=', true);
            const store = await query.load(pool);
            return store ? camelCase(store) : null;
        }
    },
    Store: {
        address: async (store, _, { pool }) => {
            const query = select().from('cart_address');
            query.where('uuid', '=', store.addressUuid);
            const address = await query.load(pool);
            const outs = address ? camelCase(address) : null;
            if (outs) {
                outs.postalCode = outs.postcode;
                outs.address = outs.address1;
            }
            return outs;
        }
    }
}