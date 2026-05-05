import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiList, FiShoppingBag, FiCalendar, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
  { to: '/admin/menu', icon: <FiList />, label: 'Menu' },
  { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { to: '/admin/bookings', icon: <FiCalendar />, label: 'Bookings' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span>🍽️ CanteenHub</span>
          <button className="sidebar-close" onClick={() => setOpen(false)}><FiX /></button>
        </div>
        <nav className="admin-sidebar-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}>
              {n.icon} <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => setOpen(true)}><FiMenu /></button>
          <div className="admin-topbar-right">
            <div className="admin-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <span className="admin-name">{user?.name}</span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
