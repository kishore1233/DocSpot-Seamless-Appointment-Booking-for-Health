const User = require('../schemas/userModel');
const Doctor = require('../schemas/docModel');
const Appointment = require('../schemas/appointmentModel');

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get All Doctors (including pending)
const getAllDoctorsAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.find({});

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Approve Doctor
const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required',
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status: 'approved' },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Update user to mark as doctor
    await User.findByIdAndUpdate(doctor.userId, {
      isdoctor: true,
      $push: {
        notification: {
          type: 'doctor-application-approved',
          message: 'Your doctor application has been approved',
          data: {},
          onClickPath: '/doctor/profile',
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Doctor approved successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Reject Doctor
const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required',
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status: 'rejected' },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Notify user
    await User.findByIdAndUpdate(doctor.userId, {
      $push: {
        notification: {
          type: 'doctor-application-rejected',
          message: 'Your doctor application has been rejected',
          data: {},
          onClickPath: '/apply-doctor',
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Doctor rejected',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get All Appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});

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

module.exports = {
  getAllUsers,
  getAllDoctorsAdmin,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
};
