import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/ArchiveIcon';
import NavigationItem from '@components/admin/cms/NavigationItem';

export default function NewAdminQuickLink({ adminNew, isSuperAdmin }) {
  if (!isSuperAdmin) {
    return null;
  }
  return <NavigationItem Icon={Icon} title="New Admin" url={adminNew} />;
}

NewAdminQuickLink.propTypes = {
  adminNew: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired
};

export const layout = {
  areaId: 'quickLinks',
  sortOrder: 20
};

export const query = `
  query Query {
    adminNew: url(routeId:"adminNew")
    isSuperAdmin: isCurrentAdminUserSuperAdmin
  }
`;
