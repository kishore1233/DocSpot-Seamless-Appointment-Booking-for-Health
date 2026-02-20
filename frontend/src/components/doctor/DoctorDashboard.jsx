import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';
import { formatDate } from '../../utils/dateUtils';
import Sidebar from '../common/Sidebar';

const statusBadge = (status) => {
  const map = { pending:'badge-pending', approved:'badge-approved', cancelled:'badge-cancelled', completed:'badge-approved' };
  return <span className={`badge-3d ${map[status] || 'badge-pending'}`}>{status}</span>;
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || '{}');

  const [doctor, setDoctor]           = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [updatingId, setUpdatingId]   = useState(null);

  useEffect(() => { init(); }, []); // eslint-disable-line

  const init = async () => {
    try {
      const token = localStorage.getItem('token');
      const h     = { Authorization: `Bearer ${token}` };
      const [docRes, apptRes] = await Promise.all([
        axios.get('/api/doctor/profile/me', { headers: h }),
        axios.get('/api/doctor/appointments/all', { headers: h }),
      ]);
      if (docRes.data.success)  setDoctor(docRes.data.data);
      if (apptRes.data.success) setAppointments(apptRes.data.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally   { setLoading(false); }
  };

  const updateStatus = async (appointmentId, status) => {
    setUpdatingId(appointmentId);
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.put('/api/doctor/appointments/update-status',
        { appointmentId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Appointment ${status}`);
        setAppointments(prev => prev.map(a => a._id === appointmentId ? { ...a, status } : a));
      }
    } catch { toast.error('Update failed'); }
    finally   { setUpdatingId(null); }
  };

  if (!user.isdoctor) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
        <div style={{ fontSize:'3rem' }}>⏳</div>
        <div style={{ fontFamily:'Syne,sans-serif', color:'var(--text-primary)', fontSize:'1.2rem' }}>Awaiting admin approval</div>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Your doctor application is under review.</p>
        <button className="btn-3d btn-secondary-3d" onClick={() => navigate('/user/dashboard')}>← Back to Dashboard</button>
      </div>
    );
  }

  const counts = {
    total:    appointments.length,
    pending:  appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed:appointments.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" />
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <div className="dashboard-greeting">Welcome, Dr. {user.name?.split(' ')[0]} 👨‍⚕️</div>
              <div className="dashboard-subline">Manage your schedule and appointments</div>
            </div>
            <button className="btn-3d btn-primary-3d" onClick={() => navigate('/doctor/profile')}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Doctor info strip */}
        {doctor && (
          <div className="glass-card" style={{ padding:'1.2rem 1.6rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#fff', fontSize:'1.1rem' }}>
              {doctor.fullname.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'var(--text-primary)' }}>Dr. {doctor.fullname}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{doctor.specialization}</div>
            </div>
            {[
              { label:'Timings', value: doctor.timings },
              { label:'Fees',    value: `₹${doctor.fees}` },
              { label:'Exp.',    value: `${doctor.experience} yrs` },
            ].map(item => (
              <div key={item.label} style={{ textAlign:'center', padding:'0 1rem', borderLeft:'1px solid var(--border)' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1rem', color:'var(--text-primary)' }}>{item.value}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="stats-row">
          {[
            { icon:'📋', val: counts.total,     label:'Total',     cls:'blue'   },
            { icon:'⏳', val: counts.pending,   label:'Pending',   cls:'purple' },
            { icon:'✅', val: counts.approved,  label:'Approved',  cls:'teal'   },
            { icon:'🏁', val: counts.completed, label:'Completed', cls:'pink'   },
          ].map(s => (
            <div key={s.label} className="stat-card-3d">
              <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
              <div className="stat-card-val">{s.val}</div>
              <div className="stat-card-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <div className="section-header-3d" style={{ marginTop:'0.5rem' }}>
          <h2 className="section-title-3d">Patient Appointments</h2>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner-3d" /></div>
        ) : appointments.length === 0 ? (
          <div className="glass-card" style={{ padding:'4rem 2rem', textAlign:'center' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>📭</div>
            <h3 style={{ fontFamily:'Syne,sans-serif', color:'var(--text-primary)', fontSize:'1.1rem', marginBottom:'0.4rem' }}>No appointments yet</h3>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>Patients will appear here once they book with you.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            {appointments.map(appt => {
              const patientName = appt.userInfo?.name || 'Patient';
              const dateStr     = !isNaN(new Date(appt.date)) ? formatDate(appt.date) : appt.date;
              return (
                <div key={appt._id} className="glass-card" style={{ padding:'1.4rem 1.6rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                  {/* Patient avatar */}
                  <div style={{ width:44, height:44, borderRadius:12, background:'rgba(167,139,250,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, color:'var(--accent)', fontSize:'1rem', flexShrink:0 }}>
                    {patientName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>{patientName}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                      <span>📅 {dateStr}</span>
                      {appt.userInfo?.phone && <span>📞 {appt.userInfo.phone}</span>}
                    </div>
                    {appt.document && (
                      <div style={{ fontSize:'0.75rem', color:'var(--accent)', marginTop:'0.3rem' }}>📎 Note: {appt.document.slice(0,80)}{appt.document.length>80?'…':''}</div>
                    )}
                  </div>

                  <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', flexShrink:0 }}>
                    {statusBadge(appt.status)}
                    {appt.status === 'pending' && (
                      <>
                        <button
                          className="btn-3d btn-success-3d btn-sm-3d"
                          disabled={updatingId === appt._id}
                          onClick={() => updateStatus(appt._id, 'approved')}
                        >
                          {updatingId === appt._id ? '…' : '✓ Approve'}
                        </button>
                        <button
                          className="btn-3d btn-danger-3d btn-sm-3d"
                          disabled={updatingId === appt._id}
                          onClick={() => updateStatus(appt._id, 'cancelled')}
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}
                    {appt.status === 'approved' && (
                      <button
                        className="btn-3d btn-secondary-3d btn-sm-3d"
                        disabled={updatingId === appt._id}
                        onClick={() => updateStatus(appt._id, 'completed')}
                      >
                        🏁 Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
