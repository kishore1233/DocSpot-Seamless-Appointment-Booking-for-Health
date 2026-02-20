const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserInfo,
  getNotifications,
  markAllAsRead,
  applyDoctor,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
} = require('../controllers/userC');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/info', authMiddleware, getUserInfo);
router.get('/notifications', authMiddleware, getNotifications);
router.put('/notifications/mark-read', authMiddleware, markAllAsRead);
router.post('/apply-doctor', authMiddleware, applyDoctor);
router.post('/book-appointment', authMiddleware, bookAppointment);
router.get('/appointments', authMiddleware, getUserAppointments);
router.put('/appointments/cancel/:appointmentId', authMiddleware, cancelAppointment);

module.exports = router;
