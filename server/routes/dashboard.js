const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');

router.get('/dashboard', async (req, res) => {
  try {
    // Fetch live classes from database
    const liveClasses = await LiveClass.find({
      scheduledAt: { $gte: new Date() }
    })
    .populate('course', 'title')
    .populate('instructor', 'name email')
    .sort({ scheduledAt: 1 })
    .limit(5);

    const dashboardData = {
      name: "Jane Doe",
      email: "edeltechcity@outlook.com",
      enrolledCourses: [
        { title: "Web3", status: "completed", progress: 100, certificateUrl: "/certs/web3.pdf" },
        { title: "Front End Development", status: "ongoing", progress: 65, certificateUrl: null },
        { title: "UI/UX Design", status: "ongoing", progress: 40, certificateUrl: null }
      ],
      upcomingClasses: liveClasses.map(cls => ({
        _id: cls._id,
        title: cls.title,
        course: cls.course.title,
        date: cls.scheduledAt,
        time: cls.scheduledAt,
        instructor: cls.instructor.name,
        status: cls.status,
        meetingLink: cls.meetingLink,
        registeredStudents: cls.registeredStudents.length
      }))
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
