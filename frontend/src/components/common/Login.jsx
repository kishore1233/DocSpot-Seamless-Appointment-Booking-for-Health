import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/user/login', formData);
      if (res.data.success) {
        const { user, token } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        toast.success(`Welcome back, ${user.name}!`);
        if (user.type === 'admin')  return navigate('/admin/dashboard');
        if (user.isdoctor)          return navigate('/doctor/dashboard');
        navigate('/user/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid-bg" />
      <div className="auth-page">
        <div className="auth-illustration">
          <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
            <div style={{ fontSize:'7rem', marginBottom:'1.5rem', filter:'drop-shadow(0 0 40px rgba(14,165,233,0.4))' }} className="float-shape">🏥</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.6rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.7rem' }}>
              Healthcare at your fingertips
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', lineHeight:1.7, maxWidth:340 }}>
              Book appointments with top doctors, manage your health records, and stay on top of your wellness journey.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem', marginTop:'2rem', alignItems:'center' }}>
              {['Real-time appointment booking','Verified specialist doctors','Instant notifications'].map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.6rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100, padding:'0.5rem 1.2rem', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                  <span style={{ color:'var(--primary)' }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-form-card">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your DocSpot account</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group-3d">
                <label className="label-3d">Email address</label>
                <input className="input-3d" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group-3d">
                <label className="label-3d">Password</label>
                <input className="input-3d" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
              <button className="btn-3d btn-primary-3d" type="submit" disabled={loading}
                style={{ width:'100%', justifyContent:'center', fontSize:'0.95rem', padding:'0.85rem', marginTop:'0.5rem' }}>
                {loading ? <><span className="spinner-3d" style={{width:16,height:16,borderWidth:2}} /> Signing in…</> : 'Sign in →'}
              </button>
            </form>

            <hr className="auth-divider" />
            <p className="auth-footer-link">Don't have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
