import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import MenuCard from '../components/MenuCard';
import './Menu.css';

const CATEGORIES = ['ALL', 'VEG', 'NON_VEG', 'DRINKS', 'SNACKS', 'DESSERTS'];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = {};
    if (category !== 'ALL') params.category = category;
    if (search.trim()) params.search = search.trim();
    setLoading(true);
    api.get('/menu', { params })
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Our Menu</h1>
          <p className="page-subtitle">Fresh, delicious food made just for you</p>
        </div>

        <div className="menu-filters">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search food items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No items found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid-4">
            {items.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
