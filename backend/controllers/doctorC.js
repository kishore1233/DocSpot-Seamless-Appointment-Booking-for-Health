const Doctor = require('../schemas/docModel');
const User = require('../schemas/userModel');
const Appointment = require('../schemas/appointmentModel');

// Get All Approved Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' });

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

// Get Doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
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

// Get Doctor Info by User ID
const getDoctorInfoByUserId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.status(200).json({
      success: true,
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

// Update Doctor Profile - Only allow specific fields to be updated
const updateDoctorProfile = async (req, res) => {
  try {
    // Whitelist fields that can be updated - prevent status update by doctor
    const allowedFields = ['fullname', 'phone', 'address', 'specialization', 'experience', 'fees', 'timings'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    }

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.userId },
      updateData,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
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

// Get Doctor Appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id });

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

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify doctor is the one treating the patient
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    // Notify user
    await User.findByIdAndUpdate(updatedAppointment.userId, {
      $push: {
        notification: {
          type: 'appointment-status-updated',
          message: `Your appointment has been ${status}`,
          data: {
            appointmentId: updatedAppointment._id,
          },
          onClickPath: '/appointments',
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updatedAppointment,
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
  getAllDoctors,
  getDoctorById,
  getDoctorInfoByUserId,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
};
