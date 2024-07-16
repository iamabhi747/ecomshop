import PropTypes from 'prop-types';
import React from 'react';
import Area from '@components/common/Area';
import { Card } from '@components/admin/cms/Card';

function FullName({ fullName }) {
  return (
    <Card.Session title="Full Name">
      <div>
        <span>{fullName}</span>
      </div>
    </Card.Session>
  );
}

FullName.propTypes = {
  fullName: PropTypes.string.isRequired
};

function Email({ email }) {
  return (
    <Card.Session title="Email">
      <div>
        <span>{email}</span>
      </div>
    </Card.Session>
  );
}

Email.propTypes = {
  email: PropTypes.string.isRequired
};

function Status({ status }) {
  return (
    <Card.Session title="Status">
      <div>
        <span>{parseInt(status, 10) === 1 ? 'Enabled' : 'Disabled'}</span>
      </div>
    </Card.Session>
  );
}

Status.propTypes = {
  status: PropTypes.number.isRequired
};

function General({ admin }) {
  return (
    <Card>
      <Area
        id="adminViewInformation"
        coreComponents={[
          {
            // eslint-disable-next-line react/no-unstable-nested-components
            component: {
              default: () => <FullName fullName={admin.fullName} />
            },
            sortOrder: 10
          },
          {
            // eslint-disable-next-line react/no-unstable-nested-components
            component: { default: () => <Email email={admin.email} /> },
            sortOrder: 15
          },
          {
            // eslint-disable-next-line react/no-unstable-nested-components
            component: { default: () => <Status status={admin.status} /> },
            sortOrder: 25
          }
        ]}
      />
    </Card>
  );
};

General.propTypes = {
  admin: PropTypes.shape({
    email: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired
  }).isRequired
};

export default function AdminView({ adminUser }) {
  return (
    <div className="grid grid-cols-3 gap-x-8 grid-flow-row ">
      <div className="col-span-2 grid grid-cols-1 gap-8 auto-rows-max">
        <Area id="order_history" noOuter />
      </div>
      <div className="col-span-1 grid grid-cols-1 gap-8 auto-rows-max">
        <General admin={adminUser} noOuter />
      </div>
    </div>
  );
};

AdminView.propTypes = {
  adminUser: PropTypes.shape({
    email: PropTypes.string,
    fullName: PropTypes.string,
    status: PropTypes.number
  }).isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query Query {
    adminUser(id: getContextValue("adminUuid", null)) {
      email
      fullName
      status
    }
  }
`;
