const {
  translate
} = require('@evershop/evershop/src/lib/locale/translate/translate');
const {
  setContextValue
} = require('../../../../graphql/services/contextHelper');

module.exports = (request, response, delegate, next) => {

    setContextValue(request, 'pageInfo', {
      title: translate('Reset password'),
      description: translate('Reset password')
    });
    next();

};
