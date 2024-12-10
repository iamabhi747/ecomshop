import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@components/common/form/Form';
import { Field } from '@components/common/form/Field';

export default function CommentForm({ action, product, account }) {
  const [error, setError] = React.useState(null);

  const onSuccess = (response) => {
    if (response.success) {
      window.location.reload();
    } else {
      setError(response.message);
    }
  }

  return (
    <div className='product-comment-form'>
      {account ? (
        <>
          <h3>Drop your Review, {account.fullName}</h3>
          {error && <div className='error'>{error}</div>}
          <Form
            id="comment-form"
            action={action}
            method="POST"
            btnText="Submit"
            onSuccess={onSuccess}
            isJSON
          >
            <Field
              name="user_name"
              label="Your Name"
              type="hidden"
              value={account.fullName}
              validationRules={['notEmpty']}
            />
            <Field
              name="comment"
              label="Your Comment"
              type="textarea"
              validationRules={['notEmpty']}
            />
            <Field
              type='hidden'
              name='product_id'
              value={product.productId}
            />
          </Form>
        </>
      ) : (
        <a className='text-red-500 font-bold' href='/account/login'>Log In to leave a review.</a>
      )}
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 10
}

CommentForm.propTypes = {
  action: PropTypes.string.isRequired,
  product: PropTypes.shape({
    productId: PropTypes.string.isRequired
  }).isRequired,
  account: PropTypes.shape({
    fullName: PropTypes.string
  })
};

CommentForm.defaultProps = {
  account: null
};

export const query = `
  query {
    action: url(routeId: "addComment"),
    product: product(id: getContextValue("productId")) {
      productId
    }
    account: currentCustomer {
      fullName
    }
  }
`;