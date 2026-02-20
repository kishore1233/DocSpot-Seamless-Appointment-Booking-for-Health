import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const getInitials = (n = '') => n.split(' ').map(c => c[0]).join('').slice(0,2).toUpperCase();

  const [formData] = useState({
    name:  user.name  || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-greeting">My Profile</div>
          <div className="dashboard-subline">Your account information</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'1.5rem', alignItems:'start' }}>
          {/* Avatar card */}
          <div className="glass-card" style={{ padding:'2rem', textAlign:'center' }}>
            <div style={{
              width:80, height:80, borderRadius:20, margin:'0 auto 1rem',
              background:'linear-gradient(135deg,var(--primary),var(--accent))',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.8rem', color:'#fff',
              boxShadow:'0 8px 32px rgba(14,165,233,0.35)',
            }}>
              {getInitials(user.name)}
            </div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.1rem', color:'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:'0.3rem' }}>{user.email}</div>
            <div style={{ marginTop:'1rem' }}>
              <span className="badge-3d badge-approved">{user.type || 'patient'}</span>
              {user.isdoctor && <span className="badge-3d badge-approved" style={{ marginLeft:'0.5rem' }}>Doctor</span>}
            </div>
          </div>

          {/* Info card */}
          <div className="glass-card" style={{ padding:'2rem' }}>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.5rem' }}>
              Account Details
            </h3>
            {[
              { label:'Full Name',  value: formData.name,  icon:'👤' },
              { label:'Email',      value: formData.email, icon:'📧' },
              { label:'Phone',      value: formData.phone || 'Not provided', icon:'📞' },
              { label:'Role',       value: user.type || 'user',  icon:'🎭' },
              { label:'Doctor',     value: user.isdoctor ? 'Yes – verified' : 'No', icon:'🩺' },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', gap:'1rem', padding:'1rem 0', borderBottom:'1px solid var(--border)', alignItems:'center' }}>
                <span style={{ fontSize:'1.1rem', width:28 }}>{row.icon}</span>
                <div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.2rem' }}>{row.label}</div>
                  <div style={{ fontSize:'0.95rem', color:'var(--text-primary)' }}>{row.value}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop:'1.5rem', padding:'1rem', background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.15)', borderRadius:12, fontSize:'0.82rem', color:'var(--text-secondary)' }}>
              ℹ️ To update your profile details, please contact support or use the settings panel.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
