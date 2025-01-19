const {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  OK
} = require('@evershop/evershop/src/lib/util/httpStatus');
const createClaim = require("../../services/createClaim");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate) => {
  try {
    // only allow for self claim
    const currentAdminUser = request.getCurrentUser();

    if (!currentAdminUser) {
      response.status(UNAUTHORIZED);
      response.json({
        error: {
          status: UNAUTHORIZED,
          message: 'Only admin can create claim'
        }
      });
      return;
    }

    const result = await createClaim(request.body, {
      routeId: request.currentRoute.id,
      currentAdminUser
    });

    response.status(OK);
    response.json({
      claim: result,
      message: 'Claim created successfully!'
    });
    return;

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
