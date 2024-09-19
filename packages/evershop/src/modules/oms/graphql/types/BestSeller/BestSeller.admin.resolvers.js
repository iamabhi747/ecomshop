const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const {
  getProductsBaseQuery
} = require('@evershop/evershop/src/modules/catalog/services/getProductsBaseQuery');
const { sql } = require('@evershop/postgres-query-builder');
const { getConfig } = require('../../../../../lib/util/getConfig');

module.exports = {
  Query: {
    // eslint-disable-next-line no-unused-vars
    bestSellers: async (args, _, { user }) => {
      const query = getProductsBaseQuery();

      // If user is super admin then show bestseller from all products
      // If user is store admin then show bestseller from only products that belong to the store
      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      query
        .leftJoin('order_item')
        .on('product.product_id', '=', 'order_item.product_id');

      query
        .select(sql('"product".*'))
        .select(sql('"product_description".*'))
        .select(sql('"product_inventory".*'))
        .select(sql('"product_image".*'))
        .select('SUM(order_item.qty)', 'soldQty')
        .select('SUM(order_item.product_id)', 'sum')
        .where('order_item_id', 'IS NOT NULL', null);
      
      if (!isSuperAdmin) {
        query.andWhere('product.store_uuid', '=', user.store_uuid);
      }

      query
        .groupBy(
          'order_item.product_id',
          'product.product_id',
          'product_description.product_description_id',
          'product_inventory.product_inventory_id',
          'product_image.product_image_id'
        )
        .orderBy('soldQty', 'DESC')
        .limit(0, 5);
      const results = await query.execute(pool);
      return results.map((p) => camelCase(p));
    }
  }
};
