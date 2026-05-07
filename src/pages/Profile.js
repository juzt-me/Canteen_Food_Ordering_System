import React from 'react';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">

          {/* AFTER */}
          <div className="profile-card card">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{user.name}</h2>
            <span className={`badge ${user.role === 'ADMIN' ? 'badge-non_veg' : 'badge-confirmed'}`}>
              {user.role}
            </span>

            <div className="profile-info">
              <div className="profile-info-row">
                <FiUser />
                <div>
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
              </div>
              <div className="profile-info-row">
                <FiMail />
                <div>
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>
              <div className="profile-info-row">
                <FiShield />
                <div>
                  <span className="info-label">Account Role</span>
                  <span className="info-value">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="profile-right">
            <h3 className="profile-section-title">Quick Actions</h3>
            <div className="profile-actions">
              <Link to="/orders" className="profile-action-card card">
                <div className="action-icon">📦</div>
                <div>
                  <h4>My Orders</h4>
                  <p>View your order history and track status</p>
                </div>
                <span>→</span>
              </Link>
              <Link to="/booking" className="profile-action-card card">
                <div className="action-icon">🪑</div>
                <div>
                  <h4>My Bookings</h4>
                  <p>View and manage your table bookings</p>
                </div>
                <span>→</span>
              </Link>
              <Link to="/menu" className="profile-action-card card">
                <div className="action-icon">🍽️</div>
                <div>
                  <h4>Browse Menu</h4>
                  <p>Explore our delicious food items</p>
                </div>
                <span>→</span>
              </Link>
              <Link to="/cart" className="profile-action-card card">
                <div className="action-icon">🛒</div>
                <div>
                  <h4>My Cart</h4>
                  <p>View items in your cart</p>
                </div>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
