import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Users, Video, PlayCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    email: string;
  };
  course: {
    title: string;
  };
  scheduledAt: string;
  duration: number;
  platform: string;
  status: string;
  meetingLink: string;
  registeredStudents: Array<{
    student: string;
    registeredAt: string;
  }>;
}

interface DashboardData {
  name: string;
  email: string;
  enrolledCourses: Array<{
    title: string;
    status: string;
    progress: number;
    certificateUrl?: string;
  }>;
  upcomingClasses: LiveClass[];
}

export default function StudentDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { name, email, enrolledCourses, upcomingClasses } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || '')}`}
              alt={name}
              className="w-16 h-16 rounded-full border-2 border-primary shadow"
            />
            <div>
              <h1 className="text-4xl font-extrabold mb-1 bg-gradient-primary bg-clip-text text-transparent">
                Welcome, {name}!
              </h1>
              <p className="text-muted-foreground text-lg">{email}</p>
              <p className="text-muted-foreground text-base">
                Your personalized learning dashboard
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/live-classes">
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold shadow-lg hover:from-green-600 hover:to-green-800 transition flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Live Classes</span>
              </button>
            </Link>
            <Link to="/admin-courses">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-900 transition flex items-center space-x-2">
                <span className="mr-2">🛠️</span>
                <span>Course Management</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-8 flex items-center">
            <div
              className="bg-primary h-8 rounded-full flex items-center justify-end px-4 text-white font-bold text-lg transition-all duration-500"
              style={{ width: `${Math.round(dashboardData?.enrolledCourses?.reduce((acc, c) => acc + c.progress, 0) / (dashboardData?.enrolledCourses?.length || 1))}%` }}
            >
              {Math.round(dashboardData?.enrolledCourses?.reduce((acc, c) => acc + c.progress, 0) / (dashboardData?.enrolledCourses?.length || 1))}%
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourses?.map((course) => (
              <Card key={course.title} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{course.title}</span>
                  <Badge
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </Badge>
                </div>
                <div className="mb-2 text-sm text-muted-foreground">
                  Progress: {course.progress}%
                </div>
                {course.status === "completed" && course.certificateUrl && (
                  <a
                    href={course.certificateUrl}
                    className="ml-4 px-4 py-1 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    🎓 Download Certificate
                  </a>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Live Classes Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Live Classes</h2>
          <div className="space-y-4">
            {upcomingClasses?.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming live classes</h3>
                    <p className="text-gray-600">Check back later for new live classes and webinars.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingClasses?.map((liveClass) => (
                  <Card key={liveClass._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {liveClass.course.title}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(liveClass.status)}>
                          {liveClass.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{liveClass.description}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(liveClass.scheduledAt), 'PPP')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {liveClass.duration} minutes
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {liveClass.registeredStudents.length} registered
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Video className="h-4 w-4 mr-2" />
                          {liveClass.platform}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Link to={`/live-classes/${liveClass._id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                      {liveClass.status === 'scheduled' && (
                        <Button variant="default" size="sm">Register</Button>
                      )}
                      {liveClass.status === 'live' && (
                        <Button variant="default" size="sm">Join Now</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
