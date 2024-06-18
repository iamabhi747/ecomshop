import PropTypes from 'prop-types';
import React from 'react';
import UsersIcon from '@heroicons/react/solid/esm/UsersIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';

export default function AdminMenuGroup({ adminGrid }) {
  return (
    <NavigationItemGroup
      id="adminMenuGroup"
      name="Admin"
      items={[
        {
          Icon: UsersIcon,
          url: adminGrid,
          title: 'Admins'
        }
      ]}
    />
  );
}

AdminMenuGroup.propTypes = {
  adminGrid: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 40
};

export const query = `
  query Query {
    adminGrid: url(routeId:"adminGrid")
  }
`;
