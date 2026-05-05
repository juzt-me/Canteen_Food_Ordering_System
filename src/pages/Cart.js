import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's confirmed bookings
  useEffect(() => {
    api.get('/bookings')
      .then(r => setBookings(r.data.filter(b => b.status === 'CONFIRMED')))
      .catch(() => setBookings([]))
      .finally(() => setBookingLoading(false));
  }, []);

  const hasActiveBooking = bookings.length > 0;
  const latestBooking = bookings[0];

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        items: cart.map(i => ({ itemId: i.id, quantity: i.quantity })),
        notes,
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <FiShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some delicious items from our menu!</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Your Cart</h1>
        </div>

        {/* Table Booking Banner */}
        {!bookingLoading && (
          <div className={`booking-banner ${hasActiveBooking ? 'booking-banner-success' : 'booking-banner-warn'}`}>
            <div className="booking-banner-icon">
              {hasActiveBooking ? <FiCheckCircle /> : <FiAlertCircle />}
            </div>
            <div className="booking-banner-text">
              {hasActiveBooking ? (
                <>
                  <strong>Table Booked ✓</strong>
                  <span>
                    Your table is reserved for {latestBooking.bookDate} at {latestBooking.bookTime} — {latestBooking.seats} seat(s)
                  </span>
                </>
              ) : (
                <>
                  <strong>No Table Booked</strong>
                  <span>Book a table before placing your order for a better experience</span>
                </>
              )}
            </div>
            {!hasActiveBooking && (
              <Link to="/booking" className="btn btn-primary btn-sm">
                <FiCalendar /> Book Table
              </Link>
            )}
          </div>
        )}

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item card">
                <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="cart-item-price">₹{item.price}</span>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <FiPlus />
                  </button>
                </div>
                <span className="cart-item-subtotal">₹{(item.price * item.quantity).toFixed(2)}</span>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>

            {/* Booking summary in sidebar */}
            {hasActiveBooking && (
              <div className="summary-booking">
                <FiCalendar />
                <div>
                  <span className="summary-booking-label">Table Booking</span>
                  <span className="summary-booking-value">
                    {latestBooking.bookDate} · {latestBooking.bookTime} · {latestBooking.seats} seats
                  </span>
                </div>
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Any special requests..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            {!hasActiveBooking && (
              <Link to="/booking" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                <FiCalendar /> Book a Table First
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
