import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span>🍽️ CanteenHub</span>
          <p>Fresh food, fast service, every day.</p>
        </div>
        <div className="footer-links">
          <Link to="/menu">Menu</Link>
          <Link to="/booking">Book Table</Link>
          <Link to="/orders">Orders</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} CanteenHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
