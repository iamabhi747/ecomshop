import PropTypes from 'prop-types';
// import React from 'react';
// import Icon from '@heroicons/react/solid/esm/DocumentIcon';
// import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';

// eslint-disable-next-line no-unused-vars
export default function CmsMenuGroup({ cmsPageGrid }) {
  return null;

  // return (
  //   <NavigationItemGroup
  //     id="cmsMenuGroup"
  //     name="CMS"
  //     items={[
  //       {
  //         Icon,
  //         url: cmsPageGrid,
  //         title: 'Pages'
  //       }
  //     ]}
  //   />
  // );
}

CmsMenuGroup.propTypes = {
  cmsPageGrid: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 60
};

export const query = `
  query Query {
    cmsPageGrid: url(routeId:"cmsPageGrid")
  }
`;
