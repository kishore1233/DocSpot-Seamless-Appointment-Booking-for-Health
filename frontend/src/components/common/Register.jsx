import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', type: 'user' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/user/register', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid-bg" />
      <div className="auth-page">
        {/* Illustration */}
        <div className="auth-illustration">
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '6rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 40px rgba(167,139,250,0.4))' }} className="float-shape">🩺</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.7rem' }}>Join DocSpot today</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 340 }}>
              Create your account and get instant access to hundreds of verified doctors across all specialties.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '2rem' }}>
              {[
                { icon: '🔒', label: 'Secure & private' },
                { icon: '⚡', label: 'Instant access' },
                { icon: '🌐', label: 'Available 24/7' },
                { icon: '💊', label: 'All specialties' },
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{f.icon}</div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="auth-panel">
          <div className="auth-form-card">
            <div style={{ marginBottom: '2rem' }}>
              <h1 className="auth-title">Create account</h1>
              <p className="auth-subtitle">Start your health journey with DocSpot</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group-3d">
                <label className="label-3d">Full name</label>
                <input className="input-3d" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group-3d">
                <label className="label-3d">Email address</label>
                <input className="input-3d" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group-3d">
                <label className="label-3d">Password</label>
                <input className="input-3d" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group-3d">
                <label className="label-3d">Phone number</label>
                <input className="input-3d" type="tel" name="phone" placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="form-group-3d">
                <label className="label-3d">Account type</label>
                <div className="radio-group-3d">
                  {['user', 'admin'].map(t => (
                    <label key={t} className={`radio-pill ${formData.type === t ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, type: t })}>
                      <input type="radio" name="type" value={t} checked={formData.type === t} onChange={handleChange} />
                      {t === 'user' ? '👤 Patient' : '⚙️ Admin'}
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn-3d btn-primary-3d" type="submit" disabled={loading}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.85rem', marginTop: '0.5rem' }}>
                {loading ? <><span className="spinner-3d" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account…</> : 'Create account →'}
              </button>
            </form>

            <hr className="auth-divider" />
            <p className="auth-footer-link">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
