import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import axios from 'axios';
import toast from '../../utils/toast';
import { formatDate } from '../../utils/dateUtils';

const statusBadge = (status) => {
  const map = {
    pending:   'badge-pending',
    approved:  'badge-approved',
    cancelled: 'badge-cancelled',
    completed: 'badge-approved',
  };
  return <span className={`badge-3d ${map[status] || 'badge-pending'}`}>{status}</span>;
};

const UserAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/user/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setAppointments(res.data.data);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `/api/user/appointments/cancel/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      }
    } catch {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const counts = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    approved:  appointments.filter(a => a.status === 'approved').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />

      {/* ── Main ── */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="dashboard-greeting">My Appointments 📅</div>
              <div className="dashboard-subline">Track and manage all your bookings</div>
            </div>
            <button className="btn-3d btn-primary-3d" onClick={() => navigate('/user/dashboard')}>
              + Book New Doctor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card-3d">
            <div className="stat-card-icon blue">📋</div>
            <div className="stat-card-val">{counts.total}</div>
            <div className="stat-card-lbl">Total Bookings</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-card-icon purple">⏳</div>
            <div className="stat-card-val">{counts.pending}</div>
            <div className="stat-card-lbl">Pending</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-card-icon teal">✅</div>
            <div className="stat-card-val">{counts.approved}</div>
            <div className="stat-card-lbl">Approved</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-card-icon pink">❌</div>
            <div className="stat-card-val">{counts.cancelled}</div>
            <div className="stat-card-lbl">Cancelled</div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="section-header-3d">
          <h2 className="section-title-3d">Booking History</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {counts.total} appointment{counts.total !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner-3d" /></div>

        ) : appointments.length === 0 ? (
          /* ── Empty state ── */
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No appointments yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You haven't booked any appointments. Browse our doctors and schedule one!
            </p>
            <button className="btn-3d btn-primary-3d" onClick={() => navigate('/user/dashboard')}>
              Browse Doctors →
            </button>
          </div>

        ) : (
          /* ── Cards grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
            {appointments.map((appt) => {
              const docName  = appt.doctorInfo?.fullname || 'Unknown Doctor';
              const initials = docName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const spec     = appt.doctorInfo?.specialization || '';
              const fees     = appt.doctorInfo?.fees || '';
              const dateStr  = !isNaN(new Date(appt.date))
                ? formatDate(appt.date)
                : appt.date;

              return (
                <div key={appt._id} className="glass-card" style={{ padding: '1.6rem', position: 'relative', overflow: 'hidden' }}>

                  {/* Coloured top stripe by status */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: appt.status === 'approved'  ? 'linear-gradient(90deg,var(--success),var(--teal))'
                               : appt.status === 'pending'  ? 'linear-gradient(90deg,var(--warning),#f97316)'
                               : appt.status === 'cancelled'? 'linear-gradient(90deg,var(--danger),#be123c)'
                               : 'linear-gradient(90deg,var(--primary),var(--accent))',
                  }} />

                  {/* Doctor row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg,var(--primary),var(--accent))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1rem',
                      boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                    }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Dr. {docName}
                      </div>
                      {spec && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                          {spec}
                        </div>
                      )}
                    </div>
                    {statusBadge(appt.status)}
                  </div>

                  {/* Info rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-muted)', width: 16, textAlign: 'center' }}>📅</span>
                      {dateStr}
                    </div>
                    {fees && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)', width: 16, textAlign: 'center' }}>💰</span>
                        <span style={{ color: 'var(--teal)', fontWeight: 600 }}>₹{fees}</span>
                        <span style={{ color: 'var(--text-muted)' }}>consultation fee</span>
                      </div>
                    )}
                    {appt.doctorInfo?.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)', width: 16, textAlign: 'center' }}>📍</span>
                        {appt.doctorInfo.address}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      <span style={{ width: 16, textAlign: 'center' }}>🆔</span>
                      <span style={{ fontFamily: 'monospace' }}>{appt._id}</span>
                    </div>
                  </div>

                  {/* Document badge */}
                  {appt.document && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, padding: '0.4rem 0.7rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--accent)' }}>
                      📎 Document attached
                    </div>
                  )}

                  {/* Cancel button — only for pending/approved */}
                  {(appt.status === 'pending' || appt.status === 'approved') && (
                    <button
                      className="btn-3d btn-danger-3d"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: cancellingId === appt._id ? 0.6 : 1 }}
                      disabled={cancellingId === appt._id}
                      onClick={() => handleCancel(appt._id)}
                    >
                      {cancellingId === appt._id
                        ? <><span className="spinner-3d" style={{ width: 14, height: 14, borderWidth: 2 }} /> Cancelling…</>
                        : '✕ Cancel Appointment'
                      }
                    </button>
                  )}

                  {appt.status === 'cancelled' && (
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.4rem' }}>
                      This appointment was cancelled
                    </div>
                  )}

                  {appt.status === 'completed' && (
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--success)', padding: '0.4rem' }}>
                      ✓ Consultation completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserAppointments;
