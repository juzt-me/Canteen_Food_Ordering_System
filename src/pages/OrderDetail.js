import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiPackage } from 'react-icons/fi';
import api from '../api/axios';
import './OrderDetail.css';

const STATUS_STEPS = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchOrder();
    api.get('/bookings').then(r => setBookings(r.data)).catch(() => {});
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!order) return <div className="empty-state"><p>Order not found</p></div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Order #{order.id}</h1>
          <p className="page-subtitle">{new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* Status Tracker */}
        <div className="card status-tracker">
          <div className="tracker-steps">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className={`tracker-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
                <div className="step-dot">{i < stepIndex ? '✓' : i + 1}</div>
                <span>{step}</span>
                {i < STATUS_STEPS.length - 1 && <div className={`step-line ${i < stepIndex ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Two column layout: Order + Bookings */}
        <div className="order-detail-layout">

          {/* Left: Order Items */}
          <div>
            <div className="card order-detail-items">
              <h3><FiPackage /> Items Ordered</h3>
              {order.items.map(item => (
                <div key={item.id} className="detail-item">
                  <img src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.itemName} />
                  <div className="detail-item-info">
                    <span>{item.itemName}</span>
                    <span className="detail-qty">x{item.quantity} × ₹{item.unitPrice}</span>
                  </div>
                  <span className="detail-subtotal">₹{item.subtotal}</span>
                </div>
              ))}
              <div className="detail-total">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            {order.notes && (
              <div className="card" style={{ padding: '16px', marginTop: '16px' }}>
                <strong>Notes:</strong> {order.notes}
              </div>
            )}
          </div>

          {/* Right: Booking History */}
          <div className="card booking-history-card">
            <div className="booking-history-header">
              <h3><FiCalendar /> Table Bookings</h3>
              <Link to="/booking" className="btn btn-primary btn-sm">+ New Booking</Link>
            </div>

            {bookings.length === 0 ? (
              <div className="no-bookings">
                <FiCalendar size={40} />
                <p>No table bookings yet</p>
                <Link to="/booking" className="btn btn-outline btn-sm">Book a Table</Link>
              </div>
            ) : (
              <div className="booking-history-list">
                {bookings.map(b => (
                  <div key={b.id} className={`booking-history-item ${b.status.toLowerCase()}`}>
                    <div className="booking-history-top">
                      <span className="booking-id">Booking #{b.id}</span>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </div>
                    <div className="booking-history-details">
                      <span><FiCalendar /> {b.bookDate}</span>
                      <span><FiClock /> {b.bookTime}</span>
                      <span><FiUsers /> {b.seats} seat(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
