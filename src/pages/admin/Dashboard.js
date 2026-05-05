import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiUsers, FiActivity } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(r => setAnalytics(r.data));
  }, []);

  const stats = analytics ? [
    { icon: <FiDollarSign />, label: 'Total Revenue', value: `₹${analytics.totalRevenue}`, color: '#22c55e' },
    { icon: <FiPackage />, label: 'Total Orders', value: analytics.totalOrders, color: '#3b82f6' },
    { icon: <FiActivity />, label: 'Active Orders', value: analytics.activeOrders, color: '#f97316' },
    { icon: <FiUsers />, label: 'Total Users', value: analytics.totalUsers, color: '#8b5cf6' },
  ] : [];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {analytics ? (
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card card">
              <div className="stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="loading-center"><div className="spinner" /></div>
      )}

      <div className="admin-nav-cards">
        {[
          { to: '/admin/menu', label: '🍔 Menu Management', desc: 'Add, edit, delete food items' },
          { to: '/admin/orders', label: '📦 Order Management', desc: 'View and update order status' },
          { to: '/admin/bookings', label: '📅 Table Bookings', desc: 'View and manage all bookings' },
        ].map(nav => (
          <Link key={nav.to} to={nav.to} className="admin-nav-card card">
            <h3>{nav.label}</h3>
            <p>{nav.desc}</p>
            <span>Go →</span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
