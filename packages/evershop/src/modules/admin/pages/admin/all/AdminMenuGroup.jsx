import PropTypes from 'prop-types';
import React from 'react';
import UsersIcon from '@heroicons/react/solid/esm/UsersIcon';
import UserIcon from '@heroicons/react/solid/UserIcon';
import CurrencyRupeeIcon from '@heroicons/react/solid/CurrencyRupeeIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';

export default function AdminMenuGroup({ adminGrid, adminView, adminClaims, isSuperAdmin, currentAdminUser }) {
  if (currentAdminUser === null) return null;

  const items = [];
  if (isSuperAdmin) {
    items.push({
      Icon: UsersIcon,
      url: adminGrid,
      title: 'Admins'
    });
  }

  items.push({
    Icon: UserIcon,
    url: adminView.replace('_-uuid-_', currentAdminUser.uuid),
    title: 'Account'
  });

  items.push({
    Icon: CurrencyRupeeIcon,
    url: adminClaims,
    title: 'Claims'
  });


  if (items.length === 0) {
    return null;
  }
  return (
    <NavigationItemGroup
      id="adminMenuGroup"
      name="Admin"
      items={items}
    />
  );
}

AdminMenuGroup.propTypes = {
  adminGrid: PropTypes.string.isRequired,
  adminView: PropTypes.string.isRequired,
  adminClaims: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  currentAdminUser: PropTypes.shape({
    uuid: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 40
};

export const query = `
  query Query {
    adminGrid: url(routeId:"adminGrid")
    adminView: url(routeId:"adminView", params: [{key:"id", value:"_-uuid-_"}])
    adminClaims: url(routeId:"adminClaims")
    isSuperAdmin: isCurrentAdminUserSuperAdmin
    currentAdminUser: currentAdminUser { uuid }
  }
`;
