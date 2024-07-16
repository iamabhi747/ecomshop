import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'urql';
// import { toast } from 'react-toastify';
import { Field } from '@components/common/form/Field';
// import { Form } from '@components/common/form/Form';
import { Card } from '@components/admin/cms/Card';
// import SettingMenu from '@components/admin/setting/SettingMenu';

const ProvincesQuery = `
  query Province($countries: [String]) {
    provinces (countries: $countries) {
      code
      name
      countryCode
    }
  }
`;

const CountriesQuery = `
  query Country($countries: [String]) {
    countries (countries: $countries) {
      code
      name
    }
  }
`;

function Province({
  selectedCountry = 'US',
  selectedProvince,
  allowedCountries = [],
  fieldName = 'storeProvince'
}) {
  const [result] = useQuery({
    query: ProvincesQuery,
    variables: { countries: allowedCountries }
  });
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return (
      <p>
        Oh no...
        {error.message}
      </p>
    );
  }
  const provinces = data.provinces.filter(
    (p) => p.countryCode === selectedCountry
  );
  if (!provinces.length) {
    return null;
  }
  return (
    <div>
      <Field
        type="select"
        value={selectedProvince}
        name={fieldName}
        label="Province"
        placeholder="Province"
        validationRules={['notEmpty']}
        options={provinces.map((p) => ({ value: p.code, text: p.name }))}
      />
    </div>
  );
}

Province.propTypes = {
  allowedCountries: PropTypes.arrayOf(PropTypes.string),
  fieldName: PropTypes.string,
  selectedCountry: PropTypes.string,
  selectedProvince: PropTypes.string
};

Province.defaultProps = {
  allowedCountries: [],
  fieldName: 'storeProvince',
  selectedCountry: 'IN',
  selectedProvince: ''
};

function Country({
  selectedCountry,
  setSelectedCountry,
  allowedCountries = [],
  fieldName = 'storeCountry'
}) {
  const onChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const [result] = useQuery({
    query: CountriesQuery,
    variables: { countries: allowedCountries }
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return (
      <p>
        Oh no...
        {error.message}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <Field
        type="select"
        value={selectedCountry}
        label="Country"
        name={fieldName}
        placeholder="Country"
        onChange={onChange}
        validationRules={['notEmpty']}
        options={data.countries.map((c) => ({ value: c.code, text: c.name }))}
      />
    </div>
  );
}

Country.propTypes = {
  allowedCountries: PropTypes.arrayOf(PropTypes.string),
  fieldName: PropTypes.string,
  selectedCountry: PropTypes.string.isRequired,
  setSelectedCountry: PropTypes.func.isRequired
};

Country.defaultProps = {
  allowedCountries: [],
  fieldName: 'storeCountry'
};

export default function Store({
  store
}) {
  const [selectedCountry, setSelectedCountry] = React.useState(() => {
    const country = store ? store.address.country : null;
    if (!country) {
      return 'IN';
    } else {
      return country;
    }
  });

  return (
    <Card>
      <Card.Session>
        <Field
          name="storeID"
          label="Store ID"
          placeholder="Store ID"
          value={store ? store.uuid : ''}
          type="text"
        />
        {!store ?
        <Field
          name="newStore"
          type="checkbox"
          label="Create new store"
          // eslint-disable-next-line no-unused-vars
          onChange={(e) => {
            //
          }}
        /> : null}
      </Card.Session>
      <Card.Session title="Store Information">
        <Field
          name="storeName"
          label="Store Name"
          placeholder="Store Name"
          value={store ? store.name : ''}
          type="text"
        />
        <Field
          name="storeDescription"
          label="Store Description"
          placeholder="Store Description"
          value={store ? store.description : ''}
          type="textarea"
        />
      </Card.Session>
      <Card.Session title="Contact Information">
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <Field
              name="storePhoneNumber"
              label="Store Phone Number"
              value={store ? store.phone : ''}
              placeholder="Store Phone Number"
              type="text"
            />
          </div>
          <div>
            <Field
              name="storeEmail"
              label="Store Email"
              value={store ? store.email : ''}
              placeholder="Store Email"
              type="text"
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session title="Address">
        <Country
          selectedCountry={store ? store.address.country : selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <Field
          name="storeAddress"
          label="Address"
          value={store ? store.address.address : ''}
          placeholder="Store Address"
          type="text"
        />
        <div className="grid grid-cols-3 gap-8 mt-8">
          <div>
            <Field
              name="storeCity"
              label="City"
              value={store ? store.address.city : ''}
              placeholder="City"
              type="text"
            />
          </div>
          <Province
            selectedProvince={store ? store.address.province : ''}
            selectedCountry={selectedCountry}
          />
          <div>
            <Field
              name="storePostalCode"
              label="PostalCode"
              value={store ? store.address.postalCode : ''}
              placeholder="PostalCode"
              type="text"
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

Store.propTypes = {
  store: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.shape({
      country: PropTypes.string,
      province: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      address: PropTypes.string
    })
  })
};

Store.defaultProps = {
  store: null
};

export const layout = {
  areaId: 'leftSide',
  sortOrder: 20
};

export const query = `
  query Query {
    store(id: getContextValue("storeID", null)) {
      uuid
      name
      description
      phone
      email
      address {
        country
        province
        city
        postalCode
        address
      }
    }
  }
`;
