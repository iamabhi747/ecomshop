import PropTypes from 'prop-types';
import React from 'react';
import PageHeading from '@components/admin/cms/PageHeading';

export default function Heading({ backUrl, adminUser }) {
  return (
    <PageHeading
      backUrl={backUrl}
      heading={`Admin ${adminUser.fullName}`}
    />
  );
}

Heading.propTypes = {
  backUrl: PropTypes.string.isRequired,
  adminUser: PropTypes.shape({
    fullName: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    adminUser(id: getContextValue("adminUuid", null)) {
      fullName
    }
    backUrl: url(routeId: "adminGrid")
  }
`;
