/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Area from '@components/common/Area';
import Pagination from '@components/common/grid/Pagination';
import { Checkbox } from '@components/common/form/fields/Checkbox';
import StatusRow from '@components/common/grid/rows/StatusRow';
import BasicRow from '@components/common/grid/rows/BasicRow';
import { Card } from '@components/admin/cms/Card';
import CustomerNameRow from '@components/admin/customer/customerGrid/rows/CustomerName';
import CreateAt from '@components/admin/customer/customerGrid/rows/CreateAt';
import { Form } from '@components/common/form/Form';
import { Field } from '@components/common/form/Field';
import SortableHeader from '@components/common/grid/headers/Sortable';
import Filter from '@components/common/list/Filter';

export default function AdminGrid({
  adminUsers: { items: admins, total, currentFilters = [] }
}) {
  const page = currentFilters.find((filter) => filter.key === 'page')
    ? currentFilters.find((filter) => filter.key === 'page').value
    : 1;
  const limit = currentFilters.find((filter) => filter.key === 'limit')
    ? currentFilters.find((filter) => filter.key === 'limit').value
    : 20;
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Card>
      <Card.Session
        title={
          <Form submitBtn={false}>
            <div className="flex gap-8 justify-center items-center">
              <Area
                id="adminGridFilter"
                noOuter
                coreComponents={[
                  {
                    component: {
                      default: () => (
                        <Field
                          type="text"
                          id="keyword"
                          placeholder="Search"
                          value={
                            currentFilters.find((f) => f.key === 'keyword')
                              ?.value
                          }
                          onKeyPress={(e) => {
                            // If the user press enter, we should submit the form
                            if (e.key === 'Enter') {
                              const url = new URL(document.location);
                              const keyword =
                                document.getElementById('keyword')?.value;
                              if (keyword) {
                                url.searchParams.set('keyword', keyword);
                              } else {
                                url.searchParams.delete('keyword');
                              }
                              window.location.href = url;
                            }
                          }}
                        />
                      )
                    },
                    sortOrder: 5
                  },
                  {
                    component: {
                      default: () => (
                        <Filter
                          options={[
                            {
                              label: 'Enabled',
                              value: '1',
                              onSelect: () => {
                                const url = new URL(document.location);
                                url.searchParams.set('status', 1);
                                window.location.href = url;
                              }
                            },
                            {
                              label: 'Disabled',
                              value: '0',
                              onSelect: () => {
                                const url = new URL(document.location);
                                url.searchParams.set('status', 0);
                                window.location.href = url;
                              }
                            }
                          ]}
                          selectedOption={
                            currentFilters.find((f) => f.key === 'status')
                              ? currentFilters.find((f) => f.key === 'status')
                                  .value === '1'
                                ? 'Enabled'
                                : 'Disabled'
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
                    setSelectedRows(admins.map((a) => a.uuid));
                  else setSelectedRows([]);
                }}
              />
            </th>
            <Area
              id="adminGridHeader"
              noOuter
              coreComponents={[
                {
                  // eslint-disable-next-line react/no-unstable-nested-components
                  component: {
                    default: () => (
                      <SortableHeader
                        title="Full Name"
                        name="full_name"
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
                        title="Email"
                        email="email"
                        currentFilters={currentFilters}
                      />
                    )
                  },
                  sortOrder: 15
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
          {/* <Actions
            customers={customers}
            selectedIds={selectedRows}
            setSelectedRows={setSelectedRows}
          /> */}
          {admins.map((a) => (
            <tr key={a.adminUserId}>
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
                id="adminGridRow"
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
                          id="name"
                          name={a.fullName}
                          //   url={a.editUrl}
                        />
                      )
                    },
                    sortOrder: 10
                  },
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: ({ areaProps }) => (
                        <BasicRow id="email" areaProps={areaProps} />
                      )
                    },
                    sortOrder: 15
                  },
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: ({ areaProps }) => (
                        <StatusRow id="status" areaProps={areaProps} />
                      )
                    },
                    sortOrder: 20
                  },
                  {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    component: {
                      default: () => <CreateAt time={a.createdAt.text} />
                    },
                    sortOrder: 25
                  }
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>
      {admins.length === 0 && (
        <div className="flex w-full justify-center">
          There is no admins to display
        </div>
      )}
      <Pagination total={total} limit={limit} page={page} />
    </Card>
  );
}

AdminGrid.propTypes = {
  adminUsers: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        admin_user_id: PropTypes.number.isRequired,
        uuid: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        createdAt: PropTypes.shape({
          value: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired
        }).isRequired
        // editUrl: PropTypes.string.isRequired,
        // updateApi: PropTypes.string.isRequired
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
  }).isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query Query($filters: [FilterInput]) {
    adminUsers (filters: $filters) {
      items {
        adminUserId
        uuid
        fullName
        email
        status
        createdAt {
          value
          text
        }
      }
      total
      currentFilters {
        key
        operation
        value
      }
    }
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;
