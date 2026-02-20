import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid-bg" />
      <section className="home-hero">
        {/* Left: Text */}
        <div>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Trusted by 50,000+ patients
          </div>

          <h1 className="display-title">
            Your Health,<br />Your Schedule.
          </h1>

          <p className="hero-tagline">
            Connect with top-rated specialists in seconds. Real-time availability,
            zero waiting rooms — healthcare that fits your life.
          </p>

          <div className="hero-cta-group">
            <button className="btn-3d btn-primary-3d" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }} onClick={() => navigate('/register')}>
              Book a Doctor →
            </button>
            <button className="btn-3d btn-secondary-3d" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }} onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">500+</div>
              <div className="hero-stat-label">Verified Doctors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">50k+</div>
              <div className="hero-stat-label">Appointments</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">98%</div>
              <div className="hero-stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Right: 3D floating cards */}
        <div className="hero-visual">
          {/* Main card */}
          <div className="glass-card hero-card-main" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#0ea5e9,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>👨‍⚕️</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Dr. Sarah Chen</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cardiologist</div>
              </div>
            </div>
            <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '0.7rem 1rem', marginBottom: '0.8rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Next available</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Today, 3:00 PM</div>
            </div>
            <button className="btn-3d btn-primary-3d" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}>
              Book Now
            </button>
          </div>

          {/* Secondary card */}
          <div className="glass-card hero-card-secondary" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Appointment confirmed</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--success)', marginBottom: '0.5rem' }}>✓ Scheduled</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Feb 19, 10:30 AM</div>
            <div style={{ marginTop: '0.7rem', padding: '0.4rem 0.7rem', background: 'rgba(16,185,129,0.1)', borderRadius: 8, fontSize: '0.7rem', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)' }}>
              Reminder sent
            </div>
          </div>

          {/* Tertiary card */}
          <div className="glass-card hero-card-tertiary" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>⭐ Rating</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)' }}>4.9</div>
            <div style={{ display: 'flex', gap: 2, marginTop: '0.3rem' }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>★</span>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
