import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import axios from 'axios';
import toast from '../../utils/toast';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/doctor/all', { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setDoctors(response.data.data);
    } catch { toast.error('Failed to fetch doctors'); }
    finally { setLoading(false); }
  };

  const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="dashboard-greeting">Good morning, {user?.name?.split(' ')[0]} 👋</div>
              <div className="dashboard-subline">Browse and book from our verified specialists</div>
            </div>
            <div className="notif-bell">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
              <div className="notif-dot" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card-3d">
            <div className="stat-card-icon blue">🏥</div>
            <div className="stat-card-val">{doctors.length}</div>
            <div className="stat-card-lbl">Available Doctors</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-card-icon purple">📅</div>
            <div className="stat-card-val">0</div>
            <div className="stat-card-lbl">My Appointments</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-card-icon teal">✅</div>
            <div className="stat-card-val">0</div>
            <div className="stat-card-lbl">Completed</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-card-icon pink">⏳</div>
            <div className="stat-card-val">0</div>
            <div className="stat-card-lbl">Pending</div>
          </div>
        </div>

        {/* Doctors grid */}
        <div className="section-header-3d">
          <h2 className="section-title-3d">Available Specialists</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{doctors.length} doctors found</span>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner-3d" /></div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩺</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', marginBottom: '0.4rem' }}>No doctors available yet</div>
            <div style={{ fontSize: '0.85rem' }}>Check back later or contact admin</div>
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card-3d">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div className="doc-avatar">{getInitials(doctor.fullname)}</div>
                  <span className="badge-3d badge-approved" style={{ fontSize: '0.68rem' }}>Available</span>
                </div>
                <div className="doc-name">Dr. {doctor.fullname}</div>
                <div className="doc-specialty">{doctor.specialization}</div>

                <div className="doc-info-row">
                  <span className="doc-info-icon">📍</span> {doctor.address}
                </div>
                <div className="doc-info-row">
                  <span className="doc-info-icon">📞</span> {doctor.phone}
                </div>
                <div className="doc-info-row">
                  <span className="doc-info-icon">🕐</span> {doctor.timings}
                </div>

                <div className="doc-tags">
                  <span className="doc-tag">{doctor.experience} yrs exp</span>
                  <span className="doc-tag" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)', borderColor: 'rgba(45,212,191,0.2)' }}>Verified</span>
                </div>

                <div className="doc-fees">₹{doctor.fees} <span style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 300 }}>per visit</span></div>

                <button className="btn-3d btn-primary-3d" style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem', padding: '0.65rem' }}
                  onClick={() => navigate('/user/book-appointment', { state: { doctor } })}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
