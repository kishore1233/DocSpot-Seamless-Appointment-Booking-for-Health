import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';
import { fromNow } from '../../utils/dateUtils';
import Sidebar from './Sidebar';

const Notifications = () => {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || 'null');
  const role     = user?.type === 'admin' ? 'admin' : user?.isdoctor ? 'doctor' : 'user';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => { fetchNotifs(); }, []); // eslint-disable-line

  const fetchNotifs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get('/api/user/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setNotifications(res.data.data || []);
    } catch { toast.error('Failed to load notifications'); }
    finally   { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/user/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch { toast.error('Failed to clear notifications'); }
  };

  const iconFor = (type = '') => {
    if (type.includes('approved'))  return { icon: '✅', color: 'var(--success)',  bg: 'rgba(16,185,129,0.10)' };
    if (type.includes('rejected'))  return { icon: '❌', color: 'var(--danger)',   bg: 'rgba(244,63,94,0.10)'  };
    if (type.includes('cancelled')) return { icon: '🚫', color: 'var(--warning)',  bg: 'rgba(245,158,11,0.10)' };
    if (type.includes('new'))       return { icon: '🔔', color: 'var(--primary)',  bg: 'rgba(14,165,233,0.10)' };
    return                                 { icon: '💬', color: 'var(--accent)',   bg: 'rgba(167,139,250,0.10)'};
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} notifCount={notifications.length} />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <div className="dashboard-greeting">Notifications 🔔</div>
              <div className="dashboard-subline">Stay updated on your appointments and requests</div>
            </div>
            {notifications.length > 0 && (
              <button className="btn-3d btn-secondary-3d" onClick={markAllRead}>
                ✓ Mark all as read
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner-3d" /></div>
        ) : notifications.length === 0 ? (
          <div className="glass-card" style={{ padding:'4rem 2rem', textAlign:'center' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎉</div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:'0.5rem' }}>
              You're all caught up!
            </h3>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>No new notifications right now.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            {notifications.map((n, i) => {
              const { icon, color, bg } = iconFor(n.type || '');
              return (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding:'1.2rem 1.5rem', display:'flex', alignItems:'flex-start', gap:'1rem', cursor: n.onClickPath ? 'pointer' : 'default' }}
                  onClick={() => n.onClickPath && navigate(n.onClickPath)}
                >
                  <div style={{ width:42, height:42, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>
                    {icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'0.9rem', color:'var(--text-primary)', marginBottom:'0.3rem', lineHeight:1.5 }}>
                      {n.message}
                    </div>
                    {n.createdAt && (
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                        {fromNow(n.createdAt)}
                      </div>
                    )}
                  </div>
                  {n.onClickPath && (
                    <div style={{ fontSize:'0.8rem', color, fontWeight:500 }}>View →</div>
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

export default Notifications;
