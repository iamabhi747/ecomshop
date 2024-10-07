const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');
const {
  NOT_FOUND
} = require('@evershop/evershop/src/lib/util/httpStatus');

module.exports = (request, response) => {
  if (!request.isSuperAdmin())
  {
    response.status(NOT_FOUND);
    return;
  }

  setContextValue(request, 'pageInfo', {
    title: 'Payment Setting',
    description: 'Payment Setting'
  });
};
