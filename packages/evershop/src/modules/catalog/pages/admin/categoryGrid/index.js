const {
  buildFilterFromUrl
} = require('@evershop/evershop/src/lib/util/buildFilterFromUrl');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

// eslint-disable-next-line no-unused-vars
module.exports = (request, response) => {
  const isSuperAdmin = request.isSuperAdmin();
  if (!isSuperAdmin) {
    response.status(404);
    return;
  }
  
  setContextValue(request, 'pageInfo', {
    title: 'Categories',
    description: 'Categories'
  });
  setContextValue(request, 'filtersFromUrl', buildFilterFromUrl(request));
};
