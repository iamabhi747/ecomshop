import PropTypes from 'prop-types';
import React from 'react';
import AttributeIcon from '@heroicons/react/solid/esm/HashtagIcon';
import CategoryIcon from '@heroicons/react/solid/esm/LinkIcon';
import CollectionIcon from '@heroicons/react/solid/esm/TagIcon';
import ProductIcon from '@heroicons/react/solid/esm/ArchiveIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';

export default function CatalogMenuGroup({
  isSuperAdmin,
  productGrid,
  categoryGrid,
  attributeGrid,
  collectionGrid
}) {
  const items = [];

  items.push({
    Icon: ProductIcon,
    url: productGrid,
    title: 'Products'
  });

  if (isSuperAdmin) {
    items.push({
      Icon: CategoryIcon,
      url: categoryGrid,
      title: 'Categories'
    });
  }

  items.push({
    Icon: CollectionIcon,
    url: collectionGrid,
    title: 'Collections'
  });

  if (isSuperAdmin) {
    items.push({
      Icon: AttributeIcon,
      url: attributeGrid,
      title: 'Attributes'
    });
  }


  return (
    <NavigationItemGroup
      id="catalogMenuGroup"
      name="Catalog"
      items={items}
    />
  );
}

CatalogMenuGroup.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  attributeGrid: PropTypes.string.isRequired,
  categoryGrid: PropTypes.string.isRequired,
  collectionGrid: PropTypes.string.isRequired,
  productGrid: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 20
};

export const query = `
  query Query {
    productGrid: url(routeId:"productGrid")
    categoryGrid: url(routeId:"categoryGrid")
    attributeGrid: url(routeId:"attributeGrid")
    collectionGrid: url(routeId:"collectionGrid")
    isSuperAdmin: isCurrentAdminUserSuperAdmin
  }
`;
