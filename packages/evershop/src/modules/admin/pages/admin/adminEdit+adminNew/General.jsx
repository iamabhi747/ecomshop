import { Card } from '@components/admin/cms/Card';
import { Field } from '@components/common/form/Field';
import React from 'react';
import PropTypes from 'prop-types';

export default function General({
  adminUser
}) {
  return (
    <Card title="General">
      <Card.Session>
        <Field
          id="name"
          name="name"
          label="Name"
          type="text"
          value={adminUser ? adminUser.fullName : ''}
          validationRules={['nonempty']}
        />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <Field
              id="email"
              name="email"
              label="Email"
              type="email"
              value={adminUser ? adminUser.email : ''}
              validationRules={['nonempty', 'email']}
            />
          </div>
          <div>
            <Field
              id="phone"
              name="phone"
              label="Phone"
              type="text"
              value={adminUser ? adminUser.phone : ''}
              validationRules={['nonempty', 'digits']}
              prefix="91+"
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

General.propTypes = {
  adminUser: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string
  })
};

General.defaultProps = {
  adminUser: null
};

export const layout = {
  areaId: 'leftSide',
  sortOrder: 10
};

export const query = `
  query Query {
    adminUser(id: getContextValue("adminUuid", null)) {
      fullName
      email
      phone
    }
  }
`;
