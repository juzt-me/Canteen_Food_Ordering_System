import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import './Admin.css';

const STATUSES = ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = () => api.get('/admin/orders').then(r => setOrders(r.data));

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? data : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = orders.filter(o =>
    String(o.id).includes(search) ||
    o.userName?.toLowerCase().includes(search.toLowerCase()) ||
    o.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLayout><div className="loading-center"><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Auto-refreshes every 10s</p>
        </div>
        <input className="admin-search" placeholder="Search by ID or user..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-table card">
        <table>
          <thead>
            <tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{order.userName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.userEmail}</div>
                </td>
                <td>
                  <div className="order-items-list">
                    {order.items.map(i => <span key={i.id}>{i.itemName} ×{i.quantity}</span>)}
                  </div>
                </td>
                <td>₹{order.total}</td>
                <td><span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select className="form-input status-select" value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No orders found</p>}
      </div>
    </AdminLayout>
  );
}
