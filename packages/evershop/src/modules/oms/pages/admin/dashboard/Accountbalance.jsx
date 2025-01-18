import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@components/admin/cms/Card';
import { toast } from 'react-toastify';

export default function AccountBalance({ api }) {
  const [data, setData] = React.useState({});
  const [fetching, setFetching] = React.useState(true);
  const { balance, currency } = data;

  React.useEffect(() => {
    if (window !== undefined) {
      fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          setFetching(false);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, []);

  return (
    <Card title="Account Balance">
      <Card.Session>
        <span
          className="balance-wrapper"
          style={{
            color: 'green',
            fontWeight: 'bold',
            fontSize: '24px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {fetching ? (
            <div className="skeleton-wrapper-lifetime">
              <div className="skeleton" />
            </div>
          ) : (
            <>
              <span>{balance}</span>
              <span style={{ marginLeft: '5px' }}>{currency}</span>
            </>
          )}
        </span>
      </Card.Session>
    </Card>
  );
}

AccountBalance.propTypes = {
  api: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'rightSide',
  sortOrder: 5
};

export const query = `
  query Query {
    api: url(routeId: "accountBalance")    
  }
`;
