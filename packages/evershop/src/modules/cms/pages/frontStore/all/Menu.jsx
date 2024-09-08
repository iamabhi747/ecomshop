import PropTypes from 'prop-types';
import React from 'react';
import './Menu.scss';

function createMenuItem(item, items) {
  if (item.parentId !== -1) return null;

  const submenu = items.filter((i) => i.parentId === item.categoryId).map((i) => (
    <a href={i.url}>{i.name}</a>
  ));

  return (
    <li className="nav-item">
      {/* <a className="nav-link hover:underline" href={i.url}>
        {i.name}
      </a> */}

      <div className="dropdown">
        <a className="dropbtn" href={item.url}>
          {item.name}
        </a>
        {submenu.length > 0 ?
        <div className="dropdown-content">
          {submenu}
        </div> : null}
      </div>

    </li>
  );
}

export default function Menu({ menu: { items } }) {
  return (
    <div className="main-menu self-center hidden md:block">
      <ul className="nav flex space-x-11 justify-content-center">
        {items.map((i) => (
          <>{createMenuItem(i, items)}</>
        ))}
      </ul>
    </div>
  );
}

Menu.propTypes = {
  menu: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
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
