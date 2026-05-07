import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUpload, FiLink, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

const EMPTY = { name: '', description: '', price: '', category: 'VEG', imageUrl: '', available: 1 };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [imageMode, setImageMode] = useState('url'); // AFTER
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const fetchItems = () => api.get('/menu').then(r => setItems(r.data));
  useEffect(() => { fetchItems(); }, []);

  // AFTER
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(p => ({ ...p, imageUrl: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    setForm(p => ({ ...p, imageUrl: e.target.value }));
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      editId ? await api.put(`/menu/${editId}`, form) : await api.post('/menu', form);
      toast.success(editId ? 'Item updated' : 'Item added');
      fetchItems();
      resetForm();
    } catch { toast.error('Operation failed'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    setImagePreview('');
    setImageMode('url');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price, category: item.category, imageUrl: item.imageUrl || '', available: item.available });
    setImagePreview(item.imageUrl || '');
    setImageMode('url');
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await api.delete(`/menu/${id}`);
    toast.success('Item deleted');
    fetchItems();
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="container">
        <div className="admin-page-header">
          <h1 className="page-title">Menu Management</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="admin-search" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <FiPlus /> Add Item
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card admin-form">
            <div className="admin-form-header">
              <h3>{editId ? 'Edit Item' : 'Add New Item'}</h3>
              <button className="icon-btn" onClick={resetForm}><FiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-grid">
              {/* AFTER */}
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={form.name} required
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>

              {/* AFTER */}
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-input" value={form.price} required
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
              </div>

              {/* AFTER */}
              <div className="form-group">
                <label className="form-label">Image</label>
                <div className="image-mode-tabs">
                  <button type="button"
                    className={`image-mode-tab ${imageMode === 'url' ? 'active' : ''}`}
                    onClick={() => setImageMode('url')}>
                    <FiLink /> URL
                  </button>
                  <button type="button"
                    className={`image-mode-tab ${imageMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setImageMode('upload')}>
                    <FiUpload /> Upload
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <input type="url" className="form-input" placeholder="https://..." value={form.imageUrl}
                    onChange={handleUrlChange} />
                ) : (
                  <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { fileInputRef.current.files = e.dataTransfer.files; handleFileChange({ target: { files: [f] } }); } }}
                  >
                    {imagePreview && imageMode === 'upload' ? (
                      <img src={imagePreview} alt="preview" className="upload-preview" />
                    ) : (
                      <>
                        <FiImage size={32} />
                        <span>Click or drag & drop image here</span>
                        <span className="upload-hint">PNG, JPG, WEBP — max 2MB</span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              {/* AFTER */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['VEG', 'NON_VEG', 'DRINKS', 'SNACKS', 'DESSERTS'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* AFTER */}
              <div className="form-group">
                <label className="form-label">Available</label>
                <select className="form-input" value={form.available}
                  onChange={e => setForm(p => ({ ...p, available: parseInt(e.target.value) }))}>
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>

              {/* AFTER */}
              {imageMode === 'url' && imagePreview && (
                <div className="form-group url-preview-wrap">
                  <label className="form-label">Preview</label>
                  <img src={imagePreview} alt="preview" className="url-preview-img"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}

              {/* AFTER */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* AFTER */}
        <div className="admin-table card">
          <table>
            <thead>
              <tr><th>Item</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="table-item-name">
                      <img src={item.imageUrl || 'https://placehold.co/40x40'} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${item.category.toLowerCase()}`}>{item.category}</span></td>
                  <td>₹{item.price}</td>
                  <td><span className={`badge ${item.available ? 'badge-confirmed' : 'badge-cancelled'}`}>{item.available ? 'Yes' : 'No'}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(item)}><FiEdit2 /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
