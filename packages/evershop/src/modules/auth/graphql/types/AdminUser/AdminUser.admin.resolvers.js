const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Query: {
    currentAdminUser: (root, args, { user }) => (user ? camelCase(user) : null),
    isCurrentAdminUserSuperAdmin: (root, args, { user }) => {
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          return true;
        }
      }
      return false;
    }
  }
};
