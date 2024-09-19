const updateCoupon = require('../../services/coupon/updateCoupon');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate) => {
  // Only super admin or owner of the coupon can delete the coupon
  const currentAdminUser = request.getCurrentUser();
  const isSuperAdmin = request.isSuperAdmin();

  request.body.store_uuid = currentAdminUser.store_uuid;
  request.body.isSuperAdmin = isSuperAdmin;

  const coupon = await updateCoupon(request.params.id, request.body, {
    routeId: request.currentRoute.id
  });

  return coupon;
};
