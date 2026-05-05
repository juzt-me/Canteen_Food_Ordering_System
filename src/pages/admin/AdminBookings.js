import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import './Admin.css';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/bookings').then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const { data } = await api.put(`/admin/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b.id === id ? data : b));
      toast.success('Booking cancelled');
    } catch { toast.error('Failed to cancel booking'); }
  };

  const filtered = bookings.filter(b =>
    String(b.id).includes(search) ||
    b.userName?.toLowerCase().includes(search.toLowerCase()) ||
    b.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLayout><div className="loading-center"><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="page-title">Table Bookings</h1>
        <input className="admin-search" placeholder="Search by ID or user..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-table card">
        <table>
          <thead>
            <tr><th>#</th><th>Customer</th><th>Date</th><th>Time</th><th>Seats</th><th>Status</th><th>Booked At</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{b.userName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.userEmail}</div>
                </td>
                <td>{b.bookDate}</td>
                <td>{b.bookTime}</td>
                <td>{b.seats}</td>
                <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
                <td>
                  {b.status === 'CONFIRMED' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No bookings found</p>}
      </div>
    </AdminLayout>
  );
}
