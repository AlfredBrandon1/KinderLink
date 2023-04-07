import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navigation.css';

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="Navigation">
      <div className="Navigation__logo">
        <Link to="/">KinderLink</Link>
      </div>
      <div className="Navigation__icon" onClick={toggleMenu}>
        {showMenu ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </div>
      <ul className={`Navigation__list ${showMenu ? 'Navigation__list--show' : ''}`}>
        <li className="Navigation__item">
          <Link to="/admin-dashboard" onClick={toggleMenu}>Dashboard</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/manage-teachers" onClick={toggleMenu}>Manage Teachers</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/manage-students" onClick={toggleMenu}>Manage Students</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/manage-admins" onClick={toggleMenu}>Manage Admins</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/manage-announcements" onClick={toggleMenu}>Announcement</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/manage-learning-materials" onClick={toggleMenu}>Learning Materials</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/my-account" onClick={toggleMenu}>My Account</Link>
        </li>
        <li className="Navigation__item">
          <Link to="/" onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                            window.localStorage.clear();
                            navigate('/');
                        }
                    }}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;