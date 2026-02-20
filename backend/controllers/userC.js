const User = require('../schemas/userModel');
const Doctor = require('../schemas/docModel');
const Appointment = require('../schemas/appointmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, type } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      type: type || 'user',
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        isdoctor: user.isdoctor,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get User Info
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get All Notifications
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.notification || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark All Notifications as Read
const markAllAsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      notification: [],
    });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Apply for Doctor
const applyDoctor = async (req, res) => {
  try {
    const { fullname, email, phone, address, specialization, experience, fees, timings } = req.body;

    const newDoctor = new Doctor({
      userId: req.userId,
      fullname,
      email,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings,
    });

    await newDoctor.save();

    // Update user to mark as doctor applicant
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        notification: {
          type: 'doctor-application-submitted',
          message: 'Your doctor application has been submitted successfully',
          data: {},
          onClickPath: '/appointments',
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Doctor application submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, userInfo, doctorInfo, document } = req.body;

    // Validate required fields
    if (!doctorId || !date || !userInfo || !doctorInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const newAppointment = new Appointment({
      userId: req.userId,
      doctorId,
      date,
      userInfo,
      doctorInfo,
      document,
    });

    await newAppointment.save();

    // Notify doctor
    await User.findByIdAndUpdate(doctor.userId, {
      $push: {
        notification: {
          type: 'new-appointment-request',
          message: `New appointment request from ${userInfo.name}`,
          data: {
            appointmentId: newAppointment._id,
          },
          onClickPath: '/appointments',
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get User Appointments
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Verify appointment exists and belongs to the user
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Authorization check - user can only cancel their own appointments
    if (appointment.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment',
      });
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'cancelled',
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  getNotifications,
  markAllAsRead,
  applyDoctor,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
};
