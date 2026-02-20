import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import axios from 'axios';
import toast from '../../utils/toast';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // If no doctor passed, go back
  if (!doctor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>😕</div>
        <div style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)', fontSize: '1.2rem' }}>No doctor selected</div>
        <button className="btn-3d btn-primary-3d" onClick={() => navigate('/user/dashboard')}>← Back to Doctors</button>
      </div>
    );
  }

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : {};

      const appointmentDateTime = `${date}T${time}:00`;

      const payload = {
        doctorId: doctor._id,
        date: appointmentDateTime,
        userInfo: {
          name: user.name || 'User',
          email: user.email || '',
          phone: user.phone || '',
        },
        doctorInfo: {
          fullname: doctor.fullname,
          specialization: doctor.specialization,
          fees: doctor.fees,
          address: doctor.address,
          phone: doctor.phone,
          timings: doctor.timings,
        },
        document: notes,
      };

      const res = await axios.post('/api/user/book-appointment', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/user/appointments');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Build min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />

      {/* ── Main ── */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn-3d btn-secondary-3d"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => navigate('/user/dashboard')}
            >
              ← Back
            </button>
            <div>
              <div className="dashboard-greeting">Book Appointment</div>
              <div className="dashboard-subline">Fill in the details to confirm your booking</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Doctor Info Card ── */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: 16, marginBottom: '1.2rem',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.5rem',
              boxShadow: '0 6px 24px rgba(14,165,233,0.35)',
            }}>
              {getInitials(doctor.fullname)}
            </div>

            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              Dr. {doctor.fullname}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1.4rem' }}>
              {doctor.specialization}
            </div>

            {/* Details */}
            {[
              { icon: '📍', label: 'Address',     value: doctor.address },
              { icon: '📞', label: 'Phone',       value: doctor.phone },
              { icon: '🕐', label: 'Timings',     value: doctor.timings },
              { icon: '🏆', label: 'Experience',  value: `${doctor.experience} years` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.9rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.9rem', marginTop: 1 }}>{row.icon}</span>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.1rem' }}>{row.label}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{row.value}</div>
                </div>
              </div>
            ))}

            {/* Fee box */}
            <div style={{
              marginTop: '1rem',
              background: 'rgba(45,212,191,0.08)',
              border: '1px solid rgba(45,212,191,0.2)',
              borderRadius: 12, padding: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Consultation Fee</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--teal)' }}>₹{doctor.fees}</div>
              </div>
              <span style={{ fontSize: '2rem' }}>💊</span>
            </div>
          </div>

          {/* ── Booking Form ── */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.6rem' }}>
              📋 Appointment Details
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Date */}
              <div className="form-group-3d">
                <label className="label-3d">Appointment Date *</label>
                <input
                  className="input-3d"
                  type="date"
                  value={date}
                  min={today}
                  onChange={e => setDate(e.target.value)}
                  required
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {/* Time */}
              <div className="form-group-3d">
                <label className="label-3d">Preferred Time *</label>
                <input
                  className="input-3d"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  style={{ colorScheme: 'dark' }}
                />
                {doctor.timings && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    💡 Doctor available: <span style={{ color: 'var(--primary)' }}>{doctor.timings}</span>
                  </div>
                )}
              </div>

              {/* Quick time slots */}
              <div className="form-group-3d">
                <label className="label-3d">Quick Select Slot</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 100,
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        border: '1px solid',
                        transition: 'all 0.2s',
                        background: time === slot ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.04)',
                        borderColor: time === slot ? 'var(--primary)' : 'var(--border)',
                        color: time === slot ? 'var(--primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes / Document */}
              <div className="form-group-3d">
                <label className="label-3d">Notes / Medical History (optional)</label>
                <textarea
                  className="input-3d"
                  rows={4}
                  placeholder="Describe your symptoms or attach any relevant medical information…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Summary box */}
              {date && time && (
                <div style={{
                  background: 'rgba(14,165,233,0.07)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  borderRadius: 12, padding: '1rem 1.2rem',
                  marginBottom: '1.2rem',
                  fontSize: '0.85rem', color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    📌 Booking Summary
                  </div>
                  <div>Doctor: <span style={{ color: 'var(--text-primary)' }}>Dr. {doctor.fullname}</span></div>
                  <div>Date &amp; Time: <span style={{ color: 'var(--text-primary)' }}>{new Date(`${date}T${time}`).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</span></div>
                  <div>Fee: <span style={{ color: 'var(--teal)', fontWeight: 600 }}>₹{doctor.fees}</span></div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  className="btn-3d btn-secondary-3d"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
                  onClick={() => navigate('/user/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d btn-primary-3d"
                  style={{ flex: 2, justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner-3d" style={{ width: 16, height: 16, borderWidth: 2 }} /> Booking…</>
                    : '✓ Confirm Appointment'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
