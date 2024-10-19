import React from 'react';
import PropTypes from 'prop-types';
import './Menu.scss';

function createMenuItem(item, items) {
  const subItems = items.filter(subItem => subItem.parentId === item.categoryId);

  return (
    <li className={`relative group ${subItems.length > 0 ? 'has-children' : ''}`}>
      {subItems.length > 0 ? (
        <>
          <span className="menu-heading">{item.name}</span>
          <ul className="dropdown-menu absolute hidden group-hover:flex">
            {subItems.map(subItem => createMenuItem(subItem, items))}
          </ul>
        </>
      ) : (
        <a href={item.url} className="menu-item">{item.name}</a>
      )}
    </li>
  );
}


export default function Menu({ menu: { items } }) {
  const rootItems = items.filter(item => item.parentId === -1);

  return (
    <div className="main-menu self-center hidden md:block">
      <ul className="nav flex space-x-8 justify-content-center">
        {rootItems.map(item => createMenuItem(item, items))}
      </ul>
    </div>
  );
}

Menu.propTypes = {
  menu: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        categoryId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        parentId: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export const layout = {
  areaId: 'header',
  sortOrder: 5
};

export const query = `
  query {
    menu {
      items {
        name
        url
        categoryId
        parentId
      }
    }
}`;
