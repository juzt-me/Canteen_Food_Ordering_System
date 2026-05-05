import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './Booking.css';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function Booking() {
  const [form, setForm] = useState({ bookDate: '', bookTime: '', seats: 2 });
  const [availability, setAvailability] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/bookings').then(r => setBookings(r.data));
  }, []);

  useEffect(() => {
    if (form.bookDate && form.bookTime) {
      api.get('/bookings/availability', { params: { date: form.bookDate, time: form.bookTime } })
        .then(r => setAvailability(r.data));
    }
  }, [form.bookDate, form.bookTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', form);
      toast.success('Table booked successfully!');
      const r = await api.get('/bookings');
      setBookings(r.data);
      setForm({ bookDate: '', bookTime: '', seats: 2 });
      setAvailability(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Book a Table</h1>
          <p className="page-subtitle">Reserve your spot at the canteen</p>
        </div>

        <div className="booking-layout">
          <div className="card booking-form">
            <h3>New Booking</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label"><FiCalendar /> Date</label>
                <input type="date" className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.bookDate}
                  onChange={e => setForm(f => ({ ...f, bookDate: e.target.value }))}
                  required />
              </div>
              <div className="form-group">
                <label className="form-label"><FiClock /> Time Slot</label>
                <div className="time-slots">
                  {TIME_SLOTS.map(t => (
                    <button type="button" key={t}
                      className={`time-slot ${form.bookTime === t ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, bookTime: t }))}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><FiUsers /> Seats</label>
                <input type="number" className="form-input" min={1} max={20}
                  value={form.seats}
                  onChange={e => setForm(f => ({ ...f, seats: parseInt(e.target.value) }))}
                  required />
              </div>
              {availability && (
                <div className={`availability-info ${availability.availableSeats < form.seats ? 'danger' : 'success'}`}>
                  {availability.availableSeats} seats available for this slot
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}
                disabled={loading || !form.bookDate || !form.bookTime}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          <div className="bookings-history">
            <h3>My Bookings</h3>
            {bookings.length === 0 ? (
              <p className="text-muted">No bookings yet</p>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="booking-item card">
                  <div className="booking-info">
                    <strong>#{b.id}</strong>
                    <span>{b.bookDate} at {b.bookTime}</span>
                    <span>{b.seats} seats</span>
                  </div>
                  <div className="booking-actions">
                    <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    {b.status === 'CONFIRMED' && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b.id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
