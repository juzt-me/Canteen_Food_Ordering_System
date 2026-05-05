import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiStar, FiShield } from 'react-icons/fi';
import './Home.css';

const features = [
  { icon: <FiClock />, title: 'Fast Service', desc: 'Order online and skip the queue' },
  { icon: <FiStar />, title: 'Quality Food', desc: 'Fresh ingredients, great taste' },
  { icon: <FiShield />, title: 'Secure Payments', desc: 'Safe and easy checkout' },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <span className="hero-tag">🔥 Order Online Now</span>
            <h1>Delicious Food,<br /><span>Delivered Fast</span></h1>
            <p>Skip the queue. Order your favorite canteen meals online and get them ready when you arrive.</p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary">
                Explore Menu <FiArrowRight />
              </Link>
              <Link to="/booking" className="btn btn-outline">
                Book a Table
              </Link>
            </div>
          </div>
          <div className="hero-image fade-in">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600" alt="Food" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card card fade-in">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <h2>Ready to Order?</h2>
          <p>Browse our full menu and place your order in seconds.</p>
          <Link to="/menu" className="btn btn-primary">View Full Menu <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}
