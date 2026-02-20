import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from '../../utils/toast';
import { formatTableDate } from '../../utils/dateUtils';
import Sidebar from '../common/Sidebar';

const statusBadge = (s) => {
  const m = { pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected', cancelled:'badge-cancelled' };
  return <span className={`badge-3d ${m[s]||'badge-pending'}`}>{s}</span>;
};

const AdminDashboard = () => {
  const [data, setData]       = useState({ users:[], doctors:[], appointments:[] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('appointments');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchAll(); }, []); // eslint-disable-line

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const h     = { Authorization:`Bearer ${token}` };
      const [u,d,a] = await Promise.all([
        axios.get('/api/admin/users',        { headers:h }),
        axios.get('/api/admin/doctors',      { headers:h }),
        axios.get('/api/admin/appointments', { headers:h }),
      ]);
      setData({ users:u.data.data, doctors:d.data.data, appointments:a.data.data });
    } catch { toast.error('Failed to load data'); }
    finally   { setLoading(false); }
  };

  const approveDoctor = async (doctorId) => {
    setUpdatingId(doctorId);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/admin/doctors/approve',{ doctorId },{ headers:{ Authorization:`Bearer ${token}` } });
      toast.success('Doctor approved!'); fetchAll();
    } catch { toast.error('Failed'); }
    finally { setUpdatingId(null); }
  };

  const rejectDoctor = async (doctorId) => {
    setUpdatingId(doctorId);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/admin/doctors/reject',{ doctorId },{ headers:{ Authorization:`Bearer ${token}` } });
      toast.success('Doctor rejected'); fetchAll();
    } catch { toast.error('Failed'); }
    finally { setUpdatingId(null); }
  };

  const { users, doctors, appointments } = data;
  const pendingDocs = doctors.filter(d => d.status==='pending');

  const tabs = [
    { key:'appointments', label:'Appointments', count: appointments.length },
    { key:'doctors',      label:'Doctors',      count: doctors.length },
    { key:'users',        label:'Users',        count: users.length },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" notifCount={pendingDocs.length} />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-greeting">Admin Dashboard 🛡️</div>
          <div className="dashboard-subline">Platform overview and management</div>
        </div>

        <div className="stats-row">
          {[
            { icon:'👥', val: users.length,         label:'Total Users',       cls:'blue'   },
            { icon:'🩺', val: doctors.filter(d=>d.status==='approved').length, label:'Active Doctors', cls:'teal' },
            { icon:'📅', val: appointments.length,  label:'Appointments',      cls:'purple' },
            { icon:'⏳', val: pendingDocs.length,   label:'Pending Approvals', cls:'pink'   },
          ].map(s => (
            <div key={s.label} className="stat-card-3d">
              <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
              <div className="stat-card-val">{s.val}</div>
              <div className="stat-card-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {pendingDocs.length > 0 && (
          <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:12, padding:'1rem 1.4rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.8rem', fontSize:'0.88rem', color:'var(--warning)' }}>
            ⚠️ <strong>{pendingDocs.length}</strong> doctor application{pendingDocs.length>1?'s':''} waiting for approval.
            <button className="btn-3d btn-secondary-3d btn-sm-3d" style={{ marginLeft:'auto' }} onClick={() => setTab('doctors')}>Review →</button>
          </div>
        )}

        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding:'0.5rem 1.2rem', border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:'0.88rem', fontWeight:500, transition:'all 0.2s', borderRadius:'8px 8px 0 0',
                background: tab===t.key ? 'rgba(14,165,233,0.12)' : 'transparent',
                color:      tab===t.key ? 'var(--primary)'         : 'var(--text-secondary)',
                borderBottom: tab===t.key ? '2px solid var(--primary)' : '2px solid transparent',
              }}>
              {t.label} <span style={{ marginLeft:'0.4rem', background:'rgba(255,255,255,0.08)', borderRadius:100, padding:'0.05rem 0.45rem', fontSize:'0.72rem' }}>{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? <div className="loading-center"><div className="spinner-3d" /></div> : (
          <div className="glass-card" style={{ padding:'1.5rem', overflowX:'auto' }}>
            {tab === 'appointments' && (
              <table className="table-3d">
                <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {appointments.length===0 && <tr><td colSpan={5} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No appointments yet</td></tr>}
                  {appointments.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'var(--text-muted)', maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a._id}</td>
                      <td style={{ color:'var(--text-primary)', fontWeight:500 }}>{a.userInfo?.name||'—'}</td>
                      <td>Dr. {a.doctorInfo?.fullname||'—'}</td>
                      <td style={{ whiteSpace:'nowrap' }}>{!isNaN(new Date(a.date))?formatTableDate(a.date):a.date}</td>
                      <td>{statusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === 'doctors' && (
              <table className="table-3d">
                <thead><tr><th>Name</th><th>Specialization</th><th>Location</th><th>Fee</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {doctors.length===0 && <tr><td colSpan={6} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No doctors yet</td></tr>}
                  {doctors.map(d => (
                    <tr key={d._id}>
                      <td style={{ color:'var(--text-primary)', fontWeight:500 }}>Dr. {d.fullname}</td>
                      <td>{d.specialization}</td>
                      <td style={{ fontSize:'0.82rem' }}>{d.address}</td>
                      <td style={{ color:'var(--teal)', fontWeight:600 }}>₹{d.fees}</td>
                      <td>{statusBadge(d.status)}</td>
                      <td>
                        {d.status==='pending' && (
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button className="btn-3d btn-success-3d btn-sm-3d" disabled={updatingId===d._id} onClick={()=>approveDoctor(d._id)}>✓ Approve</button>
                            <button className="btn-3d btn-danger-3d btn-sm-3d" disabled={updatingId===d._id} onClick={()=>rejectDoctor(d._id)}>✕ Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === 'users' && (
              <table className="table-3d">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Doctor?</th></tr></thead>
                <tbody>
                  {users.length===0 && <tr><td colSpan={5} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No users yet</td></tr>}
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ color:'var(--text-primary)', fontWeight:500 }}>{u.name}</td>
                      <td style={{ fontSize:'0.82rem' }}>{u.email}</td>
                      <td>{u.phone}</td>
                      <td><span className="badge-3d badge-approved" style={{fontSize:'0.68rem'}}>{u.type}</span></td>
                      <td>{u.isdoctor ? <span className="badge-3d badge-approved">Yes</span> : <span style={{color:'var(--text-muted)',fontSize:'0.82rem'}}>No</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
