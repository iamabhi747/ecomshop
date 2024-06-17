const { select } = require('@evershop/postgres-query-builder');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const {
  getProductsBaseQuery
} = require('../../../services/getProductsBaseQuery');
const { ProductCollection } = require('../../../services/ProductCollection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

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
    product: async (_, { id }, { pool, user}) => {
      const query = getProductsBaseQuery();
      query.where('product.product_id', '=', id);

      // If this is Admin, then only show/edit the products that belong to this admin
      // If this is Super Admin, then show/edit all products
      if (!!user) {
        let admin_uuid_filter = query.andWhere('product.admin_user_uuid', '=', user.uuid);
        
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid) {
          admin_uuid_filter.or('product.admin_user_uuid', '=', admin_super_uuid);
        }
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
      const root = new ProductCollection(query);
      await root.init(filters, !!user);
      return root;
    }
  }
};
