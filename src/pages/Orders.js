import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import api from '../api/axios';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={64} />
            <h2>No orders yet</h2>
            <p>Place your first order from our menu!</p>
            <Link to="/menu" className="btn btn-primary">Order Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link to={`/orders/${order.id}`} key={order.id} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <h4>Order #{order.id}</h4>
                    <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="order-card-items">
                  {order.items.slice(0, 3).map(item => (
                    <span key={item.id}>{item.itemName} x{item.quantity}</span>
                  ))}
                  {order.items.length > 3 && <span>+{order.items.length - 3} more</span>}
                </div>
                <div className="order-card-footer">
                  <span className="order-total">₹{order.total}</span>
                  <span className="view-link">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
