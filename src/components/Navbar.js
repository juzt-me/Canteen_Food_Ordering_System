import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiBookmark, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const closeAll = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeAll}>
          🍽️ <span>CanteenHub</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/menu" onClick={closeAll}>Menu</Link>
          {user && <Link to="/booking" onClick={closeAll}>Book Table</Link>}
          {user && <Link to="/orders" onClick={closeAll}>My Orders</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" onClick={closeAll}>Admin</Link>}
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {dark ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <>
              <Link to="/cart" className="icon-btn cart-btn" onClick={closeAll}>
                <FiShoppingCart />
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>

              {/* Click-based dropdown */}
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className={`icon-btn user-icon-btn ${dropdownOpen ? 'active' : ''}`}
                  onClick={() => setDropdownOpen(o => !o)}
                >
                  <div className="user-avatar-small">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    {/* Header */}
                    <div className="user-dropdown-header">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>

                    <div className="user-dropdown-divider" />

                    <Link to="/profile" className="dropdown-link" onClick={closeAll}>
                      <FiUser /> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-link" onClick={closeAll}>
                      <FiPackage /> My Orders
                    </Link>
                    <Link to="/booking" className="dropdown-link" onClick={closeAll}>
                      <FiBookmark /> My Bookings
                    </Link>

                    <div className="user-dropdown-divider" />

                    <button onClick={handleLogout} className="logout-btn">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
