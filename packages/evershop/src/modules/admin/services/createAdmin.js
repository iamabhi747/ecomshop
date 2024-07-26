const {
  startTransaction,
  commit,
  rollback,
  insert
} = require('@evershop/postgres-query-builder');
const {
  getConnection
} = require('@evershop/evershop/src/lib/postgres/connection');
const {
  hashPassword
} = require('@evershop/evershop/src/lib/util/passwordHelper');
const adminDataSchema = require('./adminDataSchema.json');
const { getAjv } = require('../../base/services/getAjv');


function validateAdminDataBeforeInsert(data) {
  const ajv = getAjv();
  if (data.newStore && data.newStore === '1') {
    adminDataSchema.required = [
      "name",
      "phone",
      "email",
      "newStore",
      "storeName",
      "storeDescription",
      "storePhoneNumber",
      "storeEmail",
      "storeAddress",
      "storeCity",
      "storeProvince",
      "storeCountry",
      "storePostalCode"
    ]
  }
  else {
    adminDataSchema.required = [
      "name",
      "phone",
      "email",
      "newStore",
      "storeID"
    ]
  }
  // eslint-disable-next-line
  data = Object.keys(data).reduce((filteredData, key) => {
    if (adminDataSchema.required.includes(key)) {
      // eslint-disable-next-line
      filteredData[key] = data[key];
    }
    return filteredData;
  }, {});

  const validate = ajv.compile(adminDataSchema);
  const valid = validate(data);
  if (!valid) {
    let error = 'Something went wrong!';
    if (data.newStore && data.newStore === '1') {
      for (let i = 0; i < validate.errors.length; i+=1) {
        error = validate.errors[i].message;
        if (!error.includes('Store ID')) {
          break
        }
      }
    }
    else if (data.newStore) {
      for (let i = 0; i < validate.errors.length; i+=1) {
        error = validate.errors[i].message;
        if (error.includes('Store ID')) {
          break
        }
      }
    }
    throw new Error(error);
  }

  if (data.newStore && data.newStore === '1') {
    const newData = {
      full_name: data.name,
      phone: data.phone,
      email: data.email,
      status: true,
      password: hashPassword("password1"),
      store: {
        name: data.storeName,
        description: data.storeDescription,
        phone: data.storePhoneNumber,
        email: data.storeEmail,
        status: true,
        address: {
          full_name: data.storeName,
          postcode: data.storePostalCode,
          telephone: data.storePhoneNumber,
          country: data.storeCountry,
          province: data.storeProvince,
          city: data.storeCity,
          address_1: data.storeAddress
        }
      }
    }
    return newData;
  }
  else {
    const newData = {
      full_name: data.name,
      phone: data.phone,
      email: data.email,
      status: true,
      password: hashPassword("password1"),
      store_uuid: data.storeID
    }
    return newData;
  }

}

async function insertAddress(address, connection) {
  // eslint-disable-next-line
  return await insert('cart_address')
    .given(address)
    .execute(connection);
}

async function insertStore(store, connection) {
  const address = await insertAddress(store.address, connection);
  // eslint-disable-next-line
  store.address_uuid = address.uuid;
  // eslint-disable-next-line
  return await insert('store_info')
    .given(store)
    .execute(connection);
}

// eslint-disable-next-line no-unused-vars
async function insertAdmin(data, context) {
  // eslint-disable-next-line
  data = validateAdminDataBeforeInsert(data);
  const connection = await getConnection();
  await startTransaction(connection);
  try {
    let admin = null;
    if (data.store_uuid) {
      admin = await insert('admin_user')
        .given(data)
        .execute(connection);
    }
    else {
      const store = await insertStore(data.store, connection);
      // eslint-disable-next-line
      data.store_uuid = store.uuid;
      admin = await insert('admin_user')
        .given(data)
        .execute(connection);
    }
    delete admin.password;
    await commit(connection);
    return admin;
  }
  catch (error) {
    await rollback(connection);
    throw error;
  }
  
}

module.exports = async (data, context) => {
  // Make sure the context is either not provided or is an object
  if (context && typeof context !== 'object') {
    throw new Error('Context must be an object');
  }
  const admin = await insertAdmin(data, context);
  return admin;
};