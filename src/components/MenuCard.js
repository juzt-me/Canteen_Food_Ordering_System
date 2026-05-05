import React from 'react';
import { FiStar, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './MenuCard.css';

export default function MenuCard({ item }) {
  const { addToCart, cart } = useCart();
  const inCart = cart.find(i => i.id === item.id);

  const handleAdd = () => {
    addToCart({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="menu-card card fade-in">
      <div className="menu-card-img">
        <img src={item.imageUrl || 'https://via.placeholder.com/300x200?text=Food'} alt={item.name} />
        <span className={`badge badge-${item.category.toLowerCase()} category-badge`}>
          {item.category}
        </span>
        {item.available === 0 && <div className="unavailable-overlay">Unavailable</div>}
      </div>
      <div className="menu-card-body">
        <h3 className="menu-card-title">{item.name}</h3>
        <p className="menu-card-desc">{item.description}</p>
        <div className="menu-card-footer">
          <div>
            <span className="menu-card-price">₹{item.price}</span>
            {item.avgRating && (
              <span className="menu-card-rating">
                <FiStar /> {item.avgRating.toFixed(1)} ({item.reviewCount})
              </span>
            )}
          </div>
          <button
            className={`btn btn-sm ${inCart ? 'btn-outline' : 'btn-primary'}`}
            onClick={handleAdd}
            disabled={item.available === 0}
          >
            {inCart ? <><FiCheck /> Added</> : <><FiShoppingCart /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
