import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar-3d" style={{ boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.5)' : undefined }}>
      <Link to="/" className="navbar-brand-3d">⬡ DocSpot</Link>
      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/" className="nav-link-3d" style={{ color: location.pathname === '/' ? 'var(--primary)' : undefined }}>Home</Link>
            <Link to="/login"><button className="btn-3d btn-secondary-3d" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>Login</button></Link>
            <Link to="/register"><button className="btn-3d btn-primary-3d" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>Register</button></Link>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginRight: '0.5rem' }}>👋 {user?.name}</span>
            <button className="btn-3d btn-secondary-3d" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
