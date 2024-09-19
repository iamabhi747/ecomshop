const { GraphQLJSON } = require('graphql-type-json');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const {
  getCouponsBaseQuery
} = require('../../../services/getCouponsBaseQuery');
const { CouponCollection } = require('../../../services/CouponCollection');

module.exports = {
  JSON: GraphQLJSON,
  Query: {
    coupon: async (root, { id }, { pool, user }) => {

      // If user is normal admin then only show the coupons which are owned by that admin's store
      // If user is super admin then show all coupons
      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      const query = getCouponsBaseQuery();
      query.where('coupon_id', '=', id);

      if (user && !isSuperAdmin) {
        query.andWhere('store_uuid', '=', user.store_uuid);
      }
      
      const coupon = await query.load(pool);
      return coupon ? camelCase(coupon) : null;
    },
    coupons: async (_, { filters = [] }, { user }) => {
      // This field is for admin only
      if (!user) {
        return [];
      }

      // If user is normal admin then only show the coupons which are owned by that admin's store
      // If user is super admin then show all coupons
      let isSuperAdmin = false;
      if (user) {
        const admin_super_uuid = getConfig('admin_super_uuid', null);
        if (admin_super_uuid && user.uuid === admin_super_uuid) {
          isSuperAdmin = true;
        }
      }

      const query = getCouponsBaseQuery();

      if (user && !isSuperAdmin) {
        query.andWhere('store_uuid', '=', user.store_uuid);
      }

      const root = new CouponCollection(query);
      await root.init(filters);
      return root;
    }
  },
  Coupon: {
    targetProducts: ({ targetProducts }) => {
      if (!targetProducts) {
        return null;
      } else {
        return camelCase(targetProducts);
      }
    },
    condition: ({ condition }) => {
      if (!condition) {
        return null;
      } else {
        return camelCase(condition);
      }
    },
    userCondition: ({ userCondition }) => {
      if (!userCondition) {
        return null;
      } else {
        return camelCase(userCondition);
      }
    },
    buyxGety: ({ buyxGety }) => {
      if (!buyxGety) {
        return [];
      } else {
        return buyxGety.map((item) => camelCase(item));
      }
    },
    editUrl: ({ uuid }) => buildUrl('couponEdit', { id: uuid }),
    updateApi: (coupon) => buildUrl('updateCoupon', { id: coupon.uuid }),
    deleteApi: (coupon) => buildUrl('deleteCoupon', { id: coupon.uuid })
  }
};
