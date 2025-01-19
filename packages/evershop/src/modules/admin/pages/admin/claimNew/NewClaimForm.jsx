import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Form } from '@components/common/form/Form';
import { toast } from 'react-toastify';
import { Card } from '@components/admin/cms/Card';
import { Field } from '@components/common/form/Field';
import Button from '@components/common/form/Button';
import { round } from 'lodash';

export default function ClaimNewForm({ cutPercentage, storeCurrency, action, claimsUrl }) {
  const fromId = 'claimForm';
  const [ loading, setLoading ] = useState(false);
  const [ amount, setAmount ] = useState(0);

  return (
    <Form
      method='POST'
      action={action}
      dataFilter={(formData) => {
        // eslint-disable-next-line no-param-reassign
        formData.amount = parseFloat(formData.amount);
        return formData;
      }}
      onError={() => {
        setLoading(false);
        toast.error('Something wrong. Please reload the page!');
      }}
      onSuccess={(response) => {
        setLoading(false);
        if (response.error) {
          toast.error(response.error.message || 'Something wrong. Please reload the page!');
        }
        else {
          toast.success('Claim created successfully!');
          setTimeout(() => {
            window.location.href = claimsUrl;
          }, 1500);
        }
      }}
      submitBtn={false}
      id={fromId}
    >
      <Card title='New Claim'>
        <Card.Session>
          <Field
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            label="Amount"
            type="text"
            validationRules={['notEmpty', 'number']}
            suffix={storeCurrency}
          />
        </Card.Session>
        <Card.Session>
          <Button
            title="Apply"
            onAction={() => {
              document.getElementById(fromId).dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              setLoading(true);
            }}
            isLoading={loading}
           />
          <span style={{marginLeft: `${5  }px`}}>After <b style={{colour: "green"}}>{cutPercentage}%</b> commission, You will get <b style={{colour: "green"}}>{round(amount * (100 - cutPercentage) / 100, 2)}</b></span>
        </Card.Session>
      </Card>
    </Form>
  );
}

ClaimNewForm.propTypes = {
  action: PropTypes.string.isRequired,
  claimsUrl: PropTypes.string.isRequired,
  storeCurrency: PropTypes.string.isRequired,
  cutPercentage: PropTypes.number.isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    action: url(routeId: "createClaim")
    claimsUrl: url(routeId: "adminClaims")
    storeCurrency: chillS(value: getContextValue("storeCurrency", "USD"))
    cutPercentage: chillS(value: getContextValue("cutPercentage", 0))
  }
`;