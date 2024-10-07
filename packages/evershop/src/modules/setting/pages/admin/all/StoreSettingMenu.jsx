import PropTypes from 'prop-types';
import React from 'react';
import { Card } from '@components/admin/cms/Card';

export default function StoreSettingMenu({ isSuperAdmin, storeSettingUrl }) {
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <Card.Session title={<a href={storeSettingUrl}>Store Setting</a>}>
      <div>Configure your store information</div>
    </Card.Session>
  );
}

StoreSettingMenu.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  storeSettingUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'settingPageMenu',
  sortOrder: 5
};

export const query = `
  query Query {
    storeSettingUrl: url(routeId: "storeSetting")
    isSuperAdmin: isCurrentAdminUserSuperAdmin
  }
`;
