import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const userLinks = [
  { path: '/user/dashboard',    label: 'Home',            icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { path: '/user/appointments', label: 'My Appointments', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { path: '/user/notifications',label: 'Notifications',   icon: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0' },
  { path: '/user/apply-doctor', label: 'Apply as Doctor', icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z' },
  { path: '/user/profile',      label: 'My Profile',      icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
];

const doctorLinks = [
  { path: '/doctor/dashboard',    label: 'Dashboard',      icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { path: '/doctor/appointments', label: 'Appointments',   icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { path: '/doctor/profile',      label: 'My Profile',     icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
  { path: '/doctor/notifications',label: 'Notifications',  icon: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0' },
];

const adminLinks = [
  { path: '/admin/dashboard',     label: 'Overview',       icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { path: '/admin/users',         label: 'Users',          icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z' },
  { path: '/admin/doctors',       label: 'Doctors',        icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { path: '/admin/appointments',  label: 'Appointments',   icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
];

const Sidebar = ({ role = 'user', notifCount = 0 }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const links = role === 'admin' ? adminLinks : role === 'doctor' ? doctorLinks : userLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar-3d">
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        ⬡ DocSpot
      </div>

      <div className="sidebar-section-title">
        {role === 'admin' ? 'Admin Panel' : role === 'doctor' ? 'Doctor Panel' : 'Patient Panel'}
      </div>

      <nav style={{ flex: 1 }}>
        {links.map(link => (
          <div
            key={link.path}
            className={`sidebar-nav-item ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            <Icon d={link.icon} />
            <span style={{ flex: 1 }}>{link.label}</span>
            {link.label === 'Notifications' && notifCount > 0 && (
              <span style={{
                background: 'var(--danger)', color: '#fff',
                borderRadius: '100px', fontSize: '0.65rem',
                padding: '0.1rem 0.45rem', fontWeight: 700,
              }}>{notifCount}</span>
            )}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
        <div
          className="sidebar-nav-item"
          style={{ color: 'var(--danger)' }}
          onClick={handleLogout}
        >
          <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
