const { update, select } = require('@evershop/postgres-query-builder');
const {
  getConnection
} = require('@evershop/evershop/src/lib/postgres/connection');
const {
  OK,
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
  UNAUTHORIZED
} = require('@evershop/evershop/src/lib/util/httpStatus');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const connection = await getConnection();

  // Only super admin can update claim
  const isSuperAdmin = request.isSuperAdmin();

  if (!isSuperAdmin) {
    response.status(UNAUTHORIZED);
    response.json({
      error: {
        status: UNAUTHORIZED,
        message: 'Only super admin can update claim status'
      }
    });
    return;
  }

  const claim = select()
    .from('admin_claims')
    .where('uuid', '=', request.params.id)
    .load(connection, false);

  if (!claim) {
    response.status(INVALID_PAYLOAD);
    response.json({
      error: {
        status: INVALID_PAYLOAD,
        message: 'Invalid claim id'
      }
    });
    return;
  }

  if (!request.body.status || !['pending', 'processing', 'completed', 'failed'].includes(request.body.status)) {
    response.status(INVALID_PAYLOAD);
    response.json({
      error: {
        status: INVALID_PAYLOAD,
        message: 'Invalid claim status'
      }
    });
    return;
  }

  try {
    await update('admin_claims')
      .given({
        status: request.body.status
      })
      .where('uuid', '=', request.params.id)
      .execute(connection);

    response.status(OK);
    response.json({
      message: 'Claim status updated'
    });
  }
  catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: 'Failed to update claim status'
      }
    });
  }

};
