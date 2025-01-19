/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import axios from 'axios';
import Area from '@components/common/Area';
import Pagination from '@components/common/grid/Pagination';
import { Checkbox } from '@components/common/form/fields/Checkbox';
import { useAlertContext } from '@components/common/modal/Alert';
import BasicRow from '@components/common/grid/rows/BasicRow';
import { Card } from '@components/admin/cms/Card';
import CustomerNameRow from '@components/admin/customer/customerGrid/rows/CustomerName';
import CreateAt from '@components/admin/customer/customerGrid/rows/CreateAt';
import { Form } from '@components/common/form/Form';
import SortableHeader from '@components/common/grid/headers/Sortable';
import Filter from '@components/common/list/Filter';
import ShipmentStatusRow from '@components/admin/oms/orderGrid/rows/ShipmentStatus';

function Actions({ claims = [], selectedIds = [], isSuperAdmin = false }) {
  const { openAlert, closeAlert } = useAlertContext();

  const updateClaims = async (status) => {
    const promises = claims
      .filter((a) => selectedIds.includes(a.uuid))
      .map((a) =>
        axios.patch(a.updateApi, {
          status
        })
      );
    await Promise.all(promises);
    // Refresh the page
    window.location.reload();
  };

  const actions = [];
  if (isSuperAdmin) {
    [
      {
        name: 'Mark as Processing',
        onAction: () => {
          openAlert({
            heading: `Mark ${selectedIds.length} claims as Processing`,
            content: 'Are you sure?',
            primaryAction: {
              title: 'Cancel',
              onAction: closeAlert,
              variant: 'primary'
            },
            secondaryAction: {
              title: 'Mark',
              onAction: async () => {
                await updateClaims('processing');
              },
              variant: 'critical',
              isLoading: false
            }
          });
        }
      },
      {
        name: 'Mark as completed',
        onAction: () => {
          openAlert({
            heading: `Mark ${selectedIds.length} claims as completed`,
            content: 'Are you sure?',
            primaryAction: {
              title: 'Cancel',
              onAction: closeAlert,
              variant: 'primary'
            },
            secondaryAction: {
              title: 'Mark',
              onAction: async () => {
                await updateClaims('completed');
              },
              variant: 'critical',
              isLoading: false
            }
          });
        }
      },
      {
        name: 'Mark as failed',
        onAction: () => {
          openAlert({
            heading: `Mark ${selectedIds.length} claims as failed`,
            content: 'Are you sure?',
            primaryAction: {
              title: 'Cancel',
              onAction: closeAlert,
              variant: 'primary'
            },
            secondaryAction: {
              title: 'Mark',
              onAction: async () => {
                await updateClaims('failed');
              },
              variant: 'critical',
              isLoading: false
            }
          });
        }
      }
    ].forEach((action) => actions.push(action));
  }

  return (
    <tr>
      {selectedIds.length === 0 && null}
      {selectedIds.length > 0 && (
        <td style={{ borderTop: 0 }} colSpan="100">
          <div className="inline-flex border border-divider rounded justify-items-start">
            <a href="#" className="font-semibold pt-3 pb-3 pl-6 pr-6">
              {selectedIds.length} selected
            </a>
            {actions.map((action) => (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  action.onAction();
                }}
                className="font-semibold pt-3 pb-3 pl-6 pr-6 block border-l border-divider self-center"
              >
                <span>{action.name}</span>
              </a>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
}

Actions.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  claims: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      updateApi: PropTypes.string.isRequired
    })
  ).isRequired,
  isSuperAdmin: PropTypes.bool.isRequired
};

export default function ClaimsGrid({
  claimCollection: { items: claims, total, currentFilters },
  isSuperAdmin
}) {
  const page = currentFilters.find((filter) => filter.key === 'page')
    ? parseInt(currentFilters.find((filter) => filter.key === 'page').value, 10)
    : 1;
  const limit = currentFilters.find((filter) => filter.key === 'limit')
    ? parseInt(
        currentFilters.find((filter) => filter.key === 'limit').value,
        10
      )
    : 20;
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Card>
      <Card.Session
        title={
          <Form submitBtn={false} id="claimGridFilterForm">
            <div className="flex gap-8 justify-center items-center">
              <Area
                id="claimGridFilter"
                noOuter
                coreComponents={[
                  {
                    component: {
                      default: () => (
                        <Filter
                          options={[
                            {
                              label: 'Pending',
                              value: 'pending',
                              onSelect: () => {
                                const url = new URL(document.location);
                                url.searchParams.set('status', 'pending');
                                window.location.href = url;
                              }
                            },
                            {
                              label: 'Processing',
                              value: 'processing',
                              onSelect: () => {
                                const url = new URL(document.location);
                                url.searchParams.set('status', 'processing');
                                window.location.href = url;
                              }
                            },
                            {
                              label: 'Completed',
                              value: 'completed',
                              onSelect: () => {
                                const url = new URL(document.location);
                                url.searchParams.set('status', 'completed');
                                window.location.href = url;
                              }
                            },
                            {
                              label: 'Failed',
                              value: 'failed',
                              onSelect: () => {
                                const url = new URL(document.location);
                                url.searchParams.set('status', 'failed');
                                window.location.href = url;
                              }
                            }
                          ]}
                          selectedOption={
                            currentFilters.find((f) => f.key === 'status')
                              ? currentFilters.find((f) => f.key === 'status').value
                              : undefined
                          }
                          title="Status"
                        />
                      )
                    },
                    sortOrder: 10
                  }
                ]}
                currentFilters={currentFilters}
              />
            </div>
          </Form>
        }
        actions={[
          {
            variant: 'interactive',
            name: 'Clear filter',
            onAction: () => {
              // Just get the url and remove all query params
              const url = new URL(document.location);
              url.search = '';
              window.location.href = url.href;
            }
          }
        ]}
      />
      <table className="listing sticky">
        <thead>
          <tr>
            <th className="align-bottom">
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked)
                    setSelectedRows(claims.map((a) => a.uuid));
                  else setSelectedRows([]);
                }}
              />
            </th>
            <Area
              id="claimsGridHeader"
              noOuter
              coreComponents={[
                {
                  // eslint-disable-next-line react/no-unstable-nested-components
                  component: {
                    default: () => (
                      <SortableHeader
                        title="Store"
                        name="store"
                        currentFilters={currentFilters}
                      />
                    )
                  }
                },
                {
                  // eslint-disable-next-line react/no-unstable-nested-components
                  component: {
                    default: () => (
                      <SortableHeader
                        title="Amount"
                        name="amount"
                        currentFilters={currentFilters}
                      />
                    )
                  },
                  sortOrder: 10
                },
                {
                  // eslint-disable-next-line react/no-unstable-nested-components
                  component: {
                    default: () => (
                      <SortableHeader
                        title="Status"
                        name="status"
                        currentFilters={currentFilters}
                      />
                    )
                  },
                  sortOrder: 20
                },
                {
                  // eslint-disable-next-line react/no-unstable-nested-components
                  component: {
                    default: () => (
                      <SortableHeader
                        title="Created At"
                        name="created_at"
                        currentFilters={currentFilters}
                      />
                    )
                  },
                  sortOrder: 25
                }
              ]}
            />
          </tr>
        </thead>
        <tbody>
          <Actions
            claims={claims}
            selectedIds={selectedRows}
            setSelectedRows={setSelectedRows}
            isSuperAdmin={isSuperAdmin}
          />
          {claims.map((a) => (
            <tr key={a.uuid}>
              <td>
                <Checkbox
                  isChecked={selectedRows.includes(a.uuid)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(selectedRows.concat([a.uuid]));
                    } else {
                      setSelectedRows(
                        selectedRows.filter((row) => row !== a.uuid)
                      );
                    }
                  }}
                />
              </td>
              <Area
                id="claimGridRow"
                row={a}
                noOuter
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                coreComponents={[
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: () => (
                        <CustomerNameRow
                          id="store"
                          name={a.storeName}
                          uuid={a.storeUuid}
                        />
                      )
                    }
                  },
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: ({ areaProps }) => (
                        <BasicRow id="amount" areaProps={areaProps} />
                      )
                    },
                    sortOrder: 10
                  },
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: () => (
                        <ShipmentStatusRow
                          id="status"
                          status={{
                            name: a.status,
                            badge:
                              a.status === 'completed'
                                ? 'success'
                                : a.status === 'failed'
                                ? 'critical'
                                : 'default',
                            progress:
                              a.status === 'completed'
                                ? 'complete'
                                : 'incomplete'
                          }}
                        />
                      )
                    },
                    sortOrder: 15
                  },
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: () => <CreateAt time={a.createdAt.text} />
                    },
                    sortOrder: 20
                  }
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>
      {claims.length === 0 && (
        <div className="flex w-full justify-center">
          There is no claims to display
        </div>
      )}
      <Pagination total={total} limit={limit} page={page} />
    </Card>
  );
}

ClaimsGrid.propTypes = {
  claimCollection: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        createdAt: PropTypes.shape({
          value: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired
        }).isRequired,
        storeUuid: PropTypes.string.isRequired,
        storeName: PropTypes.string.isRequired
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    currentFilters: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        operation: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  isSuperAdmin: PropTypes.bool.isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query Query($filters: [FilterInput]) {
    claimCollection: claims (filters: $filters) {
      items {
        uuid
        amount
        status
        createdAt {
          value
          text
        }
        storeUuid,
        storeName,
        updateApi
      },
      total,
      currentFilters {
        key
        operation
        value
      }
    },
    isSuperAdmin: isCurrentAdminUserSuperAdmin
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;
