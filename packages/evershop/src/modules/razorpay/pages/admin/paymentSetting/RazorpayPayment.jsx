import PropTypes from 'prop-types';
import React from 'react';
import { Field } from '@components/common/form/Field';
import { Toggle } from '@components/common/form/fields/Toggle';
import { Card } from '@components/admin/cms/Card';

export default function RazorpayPayment({
  setting: {
    razorpayPaymentStatus,
    razorpayDislayName,
    razorpayKeyId,
    razorpaySecretKey,
    razorpayWebhookSecret
  }
}) {
  return (
    <Card title="Razorpay Payment">
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>Enable?</h4>
          </div>
          <div className="col-span-2">
            <Toggle name="razorpayPaymentStatus" value={razorpayPaymentStatus} />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>Dislay Name</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="razorpayDislayName"
              placeholder="Dislay Name"
              value={razorpayDislayName}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>Key Id</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="razorpayKeyId"
              placeholder="Key Id"
              value={razorpayKeyId}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>Secret Key</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="razorpaySecretKey"
              placeholder="Secret Key"
              value={razorpaySecretKey}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>Webhook Secret Key</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="razorpayWebhookSecret"
              placeholder="Secret Key"
              value={razorpayWebhookSecret}
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

RazorpayPayment.propTypes = {
  setting: PropTypes.shape({
    razorpayPaymentStatus: PropTypes.bool,
    razorpayDislayName: PropTypes.string,
    razorpayKeyId: PropTypes.string,
    razorpaySecretKey: PropTypes.string,
    razorpayWebhookSecret: PropTypes.string
  }).isRequired
};

export const layout = {
  areaId: 'paymentSetting',
  sortOrder: 10
};

export const query = `
  query Query {
    setting {
      razorpayDislayName
      razorpayPaymentStatus
      razorpayKeyId
      razorpaySecretKey
      razorpayWebhookSecret
    }
  }
`;
