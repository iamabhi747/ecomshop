const {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED
} = require('@evershop/evershop/src/lib/util/httpStatus');
const createAdmin = require("../../services/createAdmin")

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate) => {
  // const connection = await getConnection();
  try {
    // only allow super admin to create admin user
    const isSuperAdmin = request.isSuperAdmin();
    if (!isSuperAdmin) {
      response.status(UNAUTHORIZED);
      response.json({
        error: {
          status: UNAUTHORIZED,
          message: 'Only super admin can create admin user'
        }
      });
      return null;
    }

    //
    const result = await createAdmin(request.body, {
      routeId: request.currentRoute.id
    });
    return result;

  } catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message
      }
    });
    return null;
  }
};
