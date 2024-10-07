const {
  NOT_FOUND
} = require('@evershop/evershop/src/lib/util/httpStatus');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

module.exports = (request, response) => {
  if (!request.isSuperAdmin())
  {
    response.status(NOT_FOUND);
    return;
  }

  setContextValue(request, 'pageInfo', {
    title: 'Store Setting',
    description: 'Store Setting'
  });
};
