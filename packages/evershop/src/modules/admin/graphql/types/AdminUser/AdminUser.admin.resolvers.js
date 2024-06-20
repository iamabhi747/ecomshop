const { select } = require('@evershop/postgres-query-builder');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');

module.exports = {
  Query: {
    adminUser: async (root, { id }, { pool, user }) => {
      // only allow self and super admin to view the admin user
      const admin_super_uuid = getConfig('admin_super_uuid', null);
      if (!user || !user.uuid) {
        return null;
      }
      if (user.uuid !== id && user.uuid !== admin_super_uuid) {
        return null;
      }

      const query = select().from('admin_user');
      query.where('uuid', '=', id);

      const adminUser = await query.load(pool);
      return adminUser ? camelCase(adminUser) : null;
    },

    adminUsers: async (_, { filters = [] }, { pool, user }) => {
      const query = select().from('admin_user');
      const currentFilters = [];

      // only allow super admin to view all admin users
      const admin_super_uuid = getConfig('admin_super_uuid', null);
      if (!admin_super_uuid || !user || user.uuid !== admin_super_uuid) {
        return {
          items: [],
          total: 0,
          currentFilters
        };
      }

      // Attribute filters
      filters.forEach((filter) => {
        if (filter.key === 'full_name') {
          query.andWhere('admin_user.full_name', 'LIKE', `%${filter.value}%`);
          currentFilters.push({
            key: 'full_name',
            operation: 'eq',
            value: filter.value
          });
        }
        if (filter.key === 'status') {
          query.andWhere('admin_user.status', '=', filter.value);
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
      if (sortBy && sortBy.value === 'full_name') {
        query.orderBy('admin_user.full_name', sortOrder.value);
        currentFilters.push({
          key: 'sortBy',
          operation: 'eq',
          value: sortBy.value
        });
      } else {
        query.orderBy('admin_user.admin_user_id', 'DESC');
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
      cloneQuery.select('COUNT(admin_user.admin_user_id)', 'total');
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
        items: (await query.execute(pool)).map((row) => camelCase(row)),
        total: (await cloneQuery.load(pool)).total,
        currentFilters
      };
    }
  },
  AdminUser: {
    updateApi: (adminUser) => buildUrl('updateAdmin', { id: adminUser.uuid }),
    viewUrl: (adminUser) => buildUrl('adminView', { id: adminUser.uuid })
  }
};
