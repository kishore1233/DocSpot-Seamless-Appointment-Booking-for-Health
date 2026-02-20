const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getAllDoctors,
  getDoctorById,
  getDoctorInfoByUserId,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require('../controllers/doctorC');

// Public routes
router.get('/all', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes
router.get('/profile/me', authMiddleware, getDoctorInfoByUserId);
router.put('/profile/update', authMiddleware, updateDoctorProfile);
router.get('/appointments/all', authMiddleware, getDoctorAppointments);
router.put('/appointments/update-status', authMiddleware, updateAppointmentStatus);

module.exports = router;
