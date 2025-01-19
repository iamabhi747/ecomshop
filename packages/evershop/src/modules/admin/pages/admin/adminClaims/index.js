const {
  buildFilterFromUrl
} = require('@evershop/evershop/src/lib/util/buildFilterFromUrl');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const currentAdminUser = request.getCurrentUser();
    
    if (!currentAdminUser) {
      response.status(404);
      next();
    } else {
      setContextValue(request, 'adminUuid', currentAdminUser.uuid);
      setContextValue(request, 'storeID', currentAdminUser.store_uuid);
      setContextValue(request, 'pageInfo', {
        title: 'Claims',
        description: 'Claims'
      });
      setContextValue(request, 'filtersFromUrl', buildFilterFromUrl(request));
      next();
    }
  } catch (e) {
    next(e);
  }
};
