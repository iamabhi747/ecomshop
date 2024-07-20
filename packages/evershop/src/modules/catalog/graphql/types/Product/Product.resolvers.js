const { select } = require('@evershop/postgres-query-builder');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const {
  getProductsBaseQuery
} = require('../../../services/getProductsBaseQuery');
const { ProductCollection } = require('../../../services/ProductCollection');
const { getConfig } = require('../../../../../lib/util/getConfig');

module.exports = {
  Product: {
    url: async (product, _, { pool }) => {
      // Get the url rewrite for this product
      const urlRewrite = await select()
        .from('url_rewrite')
        .where('entity_uuid', '=', product.uuid)
        .and('entity_type', '=', 'product')
        .load(pool);
      if (!urlRewrite) {
        return buildUrl('productView', { uuid: product.uuid });
      } else {
        return urlRewrite.request_path;
      }
    }
  },
  Query: {
    product: async (_, { id }, { pool, user }) => {
      const query = getProductsBaseQuery();
      query.where('product.product_id', '=', id);

      // If user is normal admin then only show the products which are owned by that admin's store
      // If user is super admin then show all products
      // If user is Customer (i.e user == null) then show only active products
      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      if (user && !isSuperAdmin) {
        query.where('product.store_uuid', '=', user.store_uuid);
      }
      
      const result = await query.load(pool);
      if (!result) {
        return null;
      } else {
        return camelCase(result);
      }
    },
    products: async (_, { filters = [] }, { user }) => {
      const query = getProductsBaseQuery();

      // If user is normal admin then only show the products which are owned by that admin's store
      // If user is super admin then show all products
      // If user is Customer (i.e user == null) then show only active products
      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      if (user && !isSuperAdmin) {
        query.where('product.store_uuid', '=', user.store_uuid);
      }
      
      const root = new ProductCollection(query);
      await root.init(filters, !!user);
      return root;
    }
  }
};
