const {
  OK,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR
} = require('@evershop/evershop/src/lib/util/httpStatus');
const deleteCoupon = require('../../services/coupon/deleteCoupon');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const { id } = request.params;

    // Only super admin or owner of the coupon can delete the coupon
    const currentAdminUser = request.getCurrentUser();
    const isSuperAdmin = request.isSuperAdmin();

    if (!currentAdminUser) {
      response.status(UNAUTHORIZED);
      response.json({
        error: {
          status: UNAUTHORIZED,
          message: 'User not found'
        }
      });
      return
    }

    const coupon = await deleteCoupon(id, currentAdminUser.store_uuid, {
      routeId: request.currentRoute.id
    }, isSuperAdmin);
    response.status(OK);
    response.json({
      data: coupon
    });
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
