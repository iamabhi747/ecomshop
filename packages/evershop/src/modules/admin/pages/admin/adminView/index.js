const { select } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    // only super admin can view other admin user
    const isSuperAdmin = request.isSuperAdmin();
    const currentAdminUser = request.getCurrentUser();
    if (!isSuperAdmin && (!currentAdminUser || currentAdminUser.uuid !== request.params.id)) {
      response.status(404);
      next();
      return;
    }

    const query = select();
    query.from('admin_user');
    query.andWhere('admin_user.uuid', '=', request.params.id);
    const adminUser = await query.load(pool);

    if (adminUser === null) {
      response.status(404);
      next();
    } else {
      setContextValue(request, 'adminUserId', adminUser.admin_user_id);
      setContextValue(request, 'adminUuid', adminUser.uuid);
      setContextValue(request, 'pageInfo', {
        title: adminUser.full_name,
        description: adminUser.full_name
      });
      next();
    }
  } catch (e) {
    next(e);
  }
};
