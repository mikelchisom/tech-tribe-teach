const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Create a new live class
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      scheduledAt,
      duration,
      platform,
      meetingLink,
      meetingId,
      meetingPassword,
      maxParticipants
    } = req.body;

    const liveClass = new LiveClass({
      title,
      description,
      instructor: req.user.id,
      course: courseId,
      scheduledAt,
      duration,
      platform,
      meetingLink,
      meetingId,
      meetingPassword,
      maxParticipants
    });

    await liveClass.save();
    
    // Populate instructor and course details
    await liveClass.populate([
      { path: 'instructor', select: 'name email' },
      { path: 'course', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all live classes with filters
router.get('/', async (req, res) => {
  try {
    const {
      courseId,
      instructorId,
      status,
      upcoming,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (courseId) query.course = courseId;
    if (instructorId) query.instructor = instructorId;
    if (status) query.status = status;
    if (upcoming === 'true') {
      query.scheduledAt = { $gte: new Date() };
      query.status = { $ne: 'cancelled' };
    }

    const classes = await LiveClass.find(query)
      .populate('instructor', 'name email')
      .populate('course', 'title')
      .sort({ scheduledAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LiveClass.countDocuments(query);

    res.json({
      success: true,
      data: classes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single live class
router.get('/:id', async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('course', 'title description')
      .populate('registeredStudents.student', 'name email');

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    res.json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update live class
router.put('/:id', auth, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    // Check if user is the instructor
    if (liveClass.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this class'
      });
    }

    const updatedClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email')
     .populate('course', 'title');

    res.json({
      success: true,
      data: updatedClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete live class
router.delete('/:id', auth, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    // Check if user is the instructor
    if (liveClass.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this class'
      });
    }

    await LiveClass.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Live class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Register for live class
router.post('/:id/register', auth, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    // Check if already registered
    const alreadyRegistered = liveClass.registeredStudents.find(
      registration => registration.student.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this class'
      });
    }

    // Check if class is full
    if (liveClass.registeredStudents.length >= liveClass.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Class is full'
      });
    }

    liveClass.registeredStudents.push({
      student: req.user.id,
      registeredAt: new Date()
    });

    await liveClass.save();

    res.json({
      success: true,
      message: 'Successfully registered for the live class'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start live class (mark as live)
router.post('/:id/start', auth, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    if (liveClass.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to start this class'
      });
    }

    liveClass.status = 'live';
    await liveClass.save();

    res.json({
      success: true,
      message: 'Class marked as live',
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// End live class (mark as completed with recording)
router.post('/:id/end', auth, async (req, res) => {
  try {
    const { recordingLink } = req.body;
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    if (liveClass.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to end this class'
      });
    }

    liveClass.status = 'completed';
    if (recordingLink) {
      liveClass.recordingLink = recordingLink;
    }
    await liveClass.save();

    res.json({
      success: true,
      message: 'Class marked as completed',
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get registered students for a live class
router.get('/:id/registrations', auth, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('registeredStudents.student', 'name email');

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: 'Live class not found'
      });
    }

    if (liveClass.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view registrations'
      });
    }

    res.json({
      success: true,
      data: liveClass.registeredStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
