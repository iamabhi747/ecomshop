const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { OK } = require('@evershop/evershop/src/lib/util/httpStatus');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const admin = await delegate.createAdmin;
  if (!admin) return;
  response.status(OK);
  response.json({
    data: {
      ...admin,
      links: [
        {
          rel: 'productGrid',
          href: buildUrl('productGrid'),
          action: 'GET',
          types: ['text/xml']
        }
      ]
    }
  });
};
