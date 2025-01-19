import PropTypes from 'prop-types';
import React from 'react';
import Button from '@components/common/form/Button';

export default function NewClaimButton({ newClaimUrl }) {
  return <Button url={newClaimUrl} title="New Claim" />;
}

NewClaimButton.propTypes = {
  newClaimUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'pageHeadingRight',
  sortOrder: 10
};

export const query = `
  query Query {
    newClaimUrl: url(routeId: "claimNew")
  }
`;
