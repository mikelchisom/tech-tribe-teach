const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  platform: {
    type: String,
    enum: ['zoom', 'google-meet', 'custom'],
    required: true
  },
  meetingLink: {
    type: String,
    required: true
  },
  meetingId: {
    type: String
  },
  meetingPassword: {
    type: String
  },
  recordingLink: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  registeredStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  remindersSent: [{
    type: {
      type: String,
      enum: ['24h', '1h', 'live']
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
liveClassSchema.index({ scheduledAt: 1 });
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ course: 1 });
liveClassSchema.index({ status: 1 });

module.exports = mongoose.model('LiveClass', liveClassSchema);
