import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import axios from 'axios';
import toast from '../../utils/toast';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '', email: user?.email || '', phone: '', address: '',
    specialization: '', experience: '', fees: '', timings: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/user/apply-doctor', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSuccess(true);
        toast.success(response.data.message);
        setTimeout(() => navigate('/user/dashboard'), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-greeting">Apply as Doctor</div>
          <div className="dashboard-subline">Submit your credentials for admin review</div>
        </div>

        {success && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', marginBottom: '1.5rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            ✅ Application submitted! Redirecting to dashboard…
          </div>
        )}

        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: 860 }}>
          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(14,165,233,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>👤</span>
                Personal Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group-3d">
                  <label className="label-3d">Full Name *</label>
                  <input className="input-3d" type="text" name="fullname" placeholder="Dr. John Smith" value={formData.fullname} onChange={handleChange} required />
                </div>
                <div className="form-group-3d">
                  <label className="label-3d">Phone *</label>
                  <input className="input-3d" type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group-3d">
                  <label className="label-3d">Email *</label>
                  <input className="input-3d" type="email" name="email" placeholder="doctor@hospital.com" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group-3d">
                <label className="label-3d">Address *</label>
                <input className="input-3d" type="text" name="address" placeholder="City, State" value={formData.address} onChange={handleChange} required />
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

            {/* Professional Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(167,139,250,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🩺</span>
                Professional Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group-3d">
                  <label className="label-3d">Specialization *</label>
                  <input className="input-3d" type="text" name="specialization" placeholder="Cardiology" value={formData.specialization} onChange={handleChange} required />
                </div>
                <div className="form-group-3d">
                  <label className="label-3d">Experience (years) *</label>
                  <input className="input-3d" type="number" name="experience" placeholder="5" value={formData.experience} onChange={handleChange} required />
                </div>
                <div className="form-group-3d">
                  <label className="label-3d">Consultation Fees (₹) *</label>
                  <input className="input-3d" type="number" name="fees" placeholder="500" value={formData.fees} onChange={handleChange} required />
                </div>
                <div className="form-group-3d">
                  <label className="label-3d">Timings *</label>
                  <input className="input-3d" type="text" name="timings" placeholder="09:00 - 17:00" value={formData.timings} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn-3d btn-secondary-3d" onClick={() => navigate('/user/dashboard')}>Cancel</button>
              <button type="submit" className="btn-3d btn-primary-3d" disabled={loading} style={{ padding: '0.75rem 2rem' }}>
                {loading ? <><span className="spinner-3d" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting…</> : 'Submit Application →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ApplyDoctor;
