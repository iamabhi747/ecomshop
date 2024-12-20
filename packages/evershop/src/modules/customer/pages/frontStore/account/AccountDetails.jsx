import PropTypes from 'prop-types';
import React from 'react';
import EmailIcon from '@heroicons/react/outline/MailIcon';
import User from '@heroicons/react/outline/UserIcon';

export default function AccountDetails({ account }) {
  return (
    <div className="account-details">
      <div className="account-details-inner">
        <div className="grid grid-cols-1 gap-7">
          <div className="account-details-name flex gap-7">
            <div>
              <User width={20} height={20} />
            </div>
            <div>{account.fullName}</div>
          </div>
          <div className="account-details-email flex gap-4">
            <div>
              <EmailIcon width={20} height={20} />
            </div>
            <div>{account.email}</div>
          </div>
          <div className='changePassword'>
            <a className='text-white bg-[#ff4447] p-4 rounded-md m-5 hover:bg-[#ff6163]' href="/account/change-password" >
              Change Password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

AccountDetails.propTypes = {
  account: PropTypes.shape({
    email: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'accountPageRight',
  sortOrder: 10
};

export const query = `
  query Query {
    account: currentCustomer {
      uuid
      fullName
      email
    }
  }
`;
