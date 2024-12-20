import PropTypes from 'prop-types';
import React from 'react';
import { Card } from '@components/admin/cms/Card';

export default function PaymentSettingMenu({ isSuperAdmin, paymentSettingUrl }) {
  if (!isSuperAdmin) {
    return null;
  }
  return (
    <Card.Session title={<a href={paymentSettingUrl}>Payment Setting</a>}>
      <div>Configure the available payment methods</div>
    </Card.Session>
  );
}

PaymentSettingMenu.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  paymentSettingUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'settingPageMenu',
  sortOrder: 10
};

export const query = `
  query Query {
    paymentSettingUrl: url(routeId: "paymentSetting")
    isSuperAdmin: isCurrentAdminUserSuperAdmin
  }
`;
