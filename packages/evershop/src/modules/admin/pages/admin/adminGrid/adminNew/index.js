const {
  setContextValue
} = require('../../../../../graphql/services/contextHelper');

// eslint-disable-next-line no-unused-vars
module.exports = (request, response) => {
  const isSuperAdmin = request.isSuperAdmin();
  if (!isSuperAdmin) {
    response.status(404);
    return;
  }
  setContextValue(request, 'pageInfo', {
    title: 'Create a new Admin',
    description: 'Create a new Admin'
  });
};
