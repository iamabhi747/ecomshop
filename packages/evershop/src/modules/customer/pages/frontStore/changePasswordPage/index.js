const {
  translate
} = require('@evershop/evershop/src/lib/locale/translate/translate');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

module.exports = (request, response, delegate, next) => {

  setContextValue(request, 'pageInfo', {
    title: translate('Change Password'),
    description: translate('Change password')
  });
  next();

};
