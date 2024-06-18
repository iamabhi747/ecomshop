import PropTypes from 'prop-types';
import React from 'react';
import UsersIcon from '@heroicons/react/solid/esm/UsersIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';

export default function AdminMenuGroup({ adminGrid, isSuperAdmin }) {
  const items = [];
  if (isSuperAdmin) {
    items.push({
      Icon: UsersIcon,
      url: adminGrid,
      title: 'Admins'
    });
  }

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
  isSuperAdmin: PropTypes.bool.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 40
};

export const query = `
  query Query {
    adminGrid: url(routeId:"adminGrid")
    isSuperAdmin: isCurrentAdminUserSuperAdmin
  }
`;
