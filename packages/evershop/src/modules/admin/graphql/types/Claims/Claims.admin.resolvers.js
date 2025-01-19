const { select } = require('@evershop/postgres-query-builder');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');

module.exports = {
  Query: {
    claims: async (root, { filters = [] }, { pool, user }) => {
      const currentFilters = [];

      if (!user || !user.uuid || !user.store_uuid) {
        return {
          items: [],
          total: 0,
          currentFilters
        };
      }

      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      const query = select('admin_claims.uuid', 'admin_claims.amount', 'admin_claims.status', 'admin_claims.created_at').from('admin_claims');
      query.innerJoin('store_info').on('store_info.uuid', '=', 'admin_claims.store_uuid');
      query.select('store_info.uuid', 'store_uuid');
      query.select('store_info.name', 'store_name');

      if (!isSuperAdmin)
        query.where('admin_claims.store_uuid', '=', user.store_uuid);

      // Attribute filters
      filters.forEach((filter) => {
        if (filter.key === 'status') {
          query.andWhere('admin_claims.status', '=', filter.value);
          currentFilters.push({
            key: 'status',
            operation: 'eq',
            value: filter.value
          });
        }
      });

      const sortBy = filters.find((f) => f.key === 'sortBy');
      const sortOrder = filters.find(
        (f) => f.key === 'sortOrder' && ['ASC', 'DESC'].includes(f.value)
      ) || { value: 'ASC' };

      if (sortBy && sortBy.value === 'amount') {
        query.orderBy('admin_claims.amount', sortOrder.value);
      } else {
        query.orderBy('admin_claims.created_at', 'DESC');
      }

      if (sortOrder.key) {
        currentFilters.push({
          key: 'sortOrder',
          operation: 'eq',
          value: sortOrder.value
        });
      }

      // Clone the main query for getting total right before doing the paging
      const cloneQuery = query.clone();
      cloneQuery.select('COUNT(admin_claims.uuid)', 'total');
      cloneQuery.removeOrderBy();

      // Paging
      const page = filters.find((f) => f.key === 'page') || { value: 1 };
      const limit = filters.find((f) => f.key === 'limit' && f.value > 0) || {
        value: 20
      }; // TODO: Get from the config
      currentFilters.push({
        key: 'page',
        operation: 'eq',
        value: page.value
      });
      currentFilters.push({
        key: 'limit',
        operation: 'eq',
        value: limit.value
      });

      query.limit(
        (page.value - 1) * parseInt(limit.value, 10),
        parseInt(limit.value, 10)
      );

      return {
        items: (await query.execute(pool)).map((row) => {const nr = camelCase(row); nr.updateApi = buildUrl('updateClaim', { id: row.uuid }); return nr;}),
        total: (await cloneQuery.load(pool)).total,
        currentFilters
      };
    }
  }
};
