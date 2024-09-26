import PropTypes from 'prop-types';
import React from 'react';
import ProductList from '@components/frontStore/catalog/product/list/List';
import { _ } from '@evershop/evershop/src/lib/locale/translate';

export default function Products({
  category
}) {
  const items = category?.products?.items || [];
  return (
    <div>
      <ProductList products={items} countPerRow={3} />
      <span className="product-count italic block mt-8">
        {_('${count} products', { count: items.length })}
      </span>
    </div>
  );
}

Products.propTypes = {
  category: PropTypes.shape({
    products: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          productId: PropTypes.number,
          url: PropTypes.string,
          price: PropTypes.shape({
            regular: PropTypes.shape({
              value: PropTypes.float,
              text: PropTypes.string
            }),
            special: PropTypes.shape({
              value: PropTypes.float,
              text: PropTypes.string
            })
          }),
          image: PropTypes.shape({
            alt: PropTypes.string,
            listing: PropTypes.string
          })
        })
      )
    })
  })
};

Products.defaultProps = {
  category: {
    products: {
      items: []
    }
  }
};

export const layout = {
  areaId: 'productPageUpperBottom',
  sortOrder: 25
};

export const query = `
  query Query {
    category(id: getContextValue('categoryId', null)) {
      products {
        items {
          ...Product
        }
      }
    }
  }`;

export const fragments = `
  fragment Product on Product {
    productId
    name
    sku
    price {
      regular {
        value
        text
      }
      special {
        value
        text
      }
    }
    image {
      alt
      url: listing
    }
    url
  }
`;
