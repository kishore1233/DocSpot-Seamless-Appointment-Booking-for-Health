import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Common (loaded eagerly — always needed)
import Navigation     from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy-loaded pages — only downloaded when user visits that page
const Home             = lazy(() => import('./components/common/Home'));
const Login            = lazy(() => import('./components/common/Login'));
const Register         = lazy(() => import('./components/common/Register'));
const Notifications    = lazy(() => import('./components/common/Notifications'));

const UserDashboard    = lazy(() => import('./components/user/UserDashboard'));
const UserAppointments = lazy(() => import('./components/user/UserAppointments'));
const BookAppointment  = lazy(() => import('./components/user/BookAppointment'));
const ApplyDoctor      = lazy(() => import('./components/user/ApplyDoctor'));
const UserProfile      = lazy(() => import('./components/user/UserProfile'));

const DoctorDashboard  = lazy(() => import('./components/doctor/DoctorDashboard'));
const DoctorProfile    = lazy(() => import('./components/doctor/DoctorProfile'));

const AdminDashboard   = lazy(() => import('./components/admin/AdminDashboard'));

// Minimal full-screen loader shown during lazy chunk loading
const PageLoader = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner-3d" />
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/"         element={<Home />}     />
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />

            {/* User */}
            <Route path="/user/dashboard"        element={<ProtectedRoute allowedRoles={['user','admin']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/appointments"     element={<ProtectedRoute allowedRoles={['user','admin']}><UserAppointments /></ProtectedRoute>} />
            <Route path="/user/book-appointment" element={<ProtectedRoute allowedRoles={['user','admin']}><BookAppointment /></ProtectedRoute>} />
            <Route path="/user/apply-doctor"     element={<ProtectedRoute allowedRoles={['user','admin']}><ApplyDoctor /></ProtectedRoute>} />
            <Route path="/user/profile"          element={<ProtectedRoute allowedRoles={['user','admin']}><UserProfile /></ProtectedRoute>} />
            <Route path="/user/notifications"    element={<ProtectedRoute allowedRoles={['user','admin']}><Notifications /></ProtectedRoute>} />

            {/* Doctor */}
            <Route path="/doctor/dashboard"     element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/appointments"  element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/profile"       element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard"    element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users"        element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/doctors"      element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
