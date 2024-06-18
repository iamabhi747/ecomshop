const { update, select } = require('@evershop/postgres-query-builder');
const {
  getConnection
} = require('@evershop/evershop/src/lib/postgres/connection');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const {
  OK,
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
  UNAUTHORIZED
} = require('@evershop/evershop/src/lib/util/httpStatus');
const {
  hashPassword
} = require('@evershop/evershop/src/lib/util/passwordHelper');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const connection = await getConnection();
  try {

    // only allow self and super admin to update admin user
    const isSuperAdmin = request.isSuperAdmin();
    const currentAdminUser = request.getCurrentUser();
    if (!isSuperAdmin && request.params.id !== currentAdminUser.uuid) {
        response.status(UNAUTHORIZED);
        response.json({
            error: {
                status: UNAUTHORIZED,
                message: 'Only super admin can update admin user'
            }
        });
        return;
    }

    const adminUser = select()
      .from('admin_user')
      .where('uuid', '=', request.params.id)
      .load(connection, false);

    if (!adminUser) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: 'Invalid admin id'
        }
      });
      return;
    }

    // Check if password is set
    if (request.body.password) {
      // Hash the password
      request.body.password = hashPassword(request.body.password);
    }

    await update('admin_user')
      .given({
        ...request.body
      })
      .where('uuid', '=', request.params.id)
      .execute(connection, false);

    // Load updated admin
    const updatedAdmin = await select()
      .from('admin_user')
      .where('uuid', '=', request.params.id)
      .load(connection);

    response.status(OK);
    response.$body = {
      data: {
        ...updatedAdmin,
        links: [
          {
            rel: 'adminGrid',
            href: buildUrl('adminGrid'),
            action: 'GET',
            types: ['text/xml']
          }
        ]
      }
    };

    next();
  } catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message
      }
    });
  }
};
