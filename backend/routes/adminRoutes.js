const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getAllUsers,
  getAllDoctorsAdmin,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
} = require('../controllers/adminC');

// All admin routes are protected and require admin role
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/doctors', authMiddleware, adminMiddleware, getAllDoctorsAdmin);
router.put('/doctors/approve', authMiddleware, adminMiddleware, approveDoctor);
router.put('/doctors/reject', authMiddleware, adminMiddleware, rejectDoctor);
router.get('/appointments', authMiddleware, adminMiddleware, getAllAppointments);

module.exports = router;
