import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  BookOpen, 
  Star, 
  Video, 
  FileText, 
  BarChart3, 
  Bell, 
  Calendar,
  Upload,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  Award,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  students: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  thumbnail: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  enrolledDate: string;
}

interface Assignment {
  _id: string;
  title: string;
  course: string;
  student: string;
  status: 'submitted' | 'graded' | 'pending';
  grade?: number;
  submittedAt: string;
}

interface Notification {
  _id: string;
  type: 'enrollment' | 'submission' | 'question' | 'review';
  message: string;
  timestamp: string;
  read: boolean;
}

const InstructorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  // Fetch instructor data
  const { data: stats } = useQuery({
    queryKey: ['instructor-stats'],
    queryFn: async () => {
      const response = await fetch('/api/instructor/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const { data: courses } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: async () => {
      const response = await fetch('/api/instructor/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const { data: students } = useQuery({
    queryKey: ['instructor-students'],
    queryFn: async () => {
      const response = await fetch('/api/instructor/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
  });

  const { data: assignments } = useQuery({
    queryKey: ['instructor-assignments'],
    queryFn: async () => {
      const response = await fetch('/api/instructor/assignments');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      return response.json();
    },
  });

  const { data: notifications } = useQuery({
    queryKey: ['instructor-notifications'],
    queryFn: async () => {
      const response = await fetch('/api/instructor/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
  });

  const statsData = stats || {
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
    totalRevenue: 0,
    completionRate: 0,
    activeStudents: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your courses and students</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setShowCreateCourse(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                Create Course
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  {notifications?.filter((n: Notification) => !n.read).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs">
                      {notifications.filter((n: Notification) => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalStudents}</div>
              <p className="text-xs opacity-80">Active learners</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalCourses}</div>
              <p className="text-xs opacity-80">Published courses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.averageRating.toFixed(1)}</div>
              <p className="text-xs opacity-80">Course rating</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${statsData.totalRevenue.toLocaleString()}</div>
              <p className="text-xs opacity-80">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest student interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications?.slice(0, 5).map((notification: Notification) => (
                      <div key={notification._id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0">
                          {notification.type === 'enrollment' && <Users className="h-5 w-5 text-blue-500" />}
                          {notification.type === 'submission' && <FileText className="h-5 w-5 text-green-500" />}
                          {notification.type === 'question' && <MessageSquare className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Completion</CardTitle>
                  <CardDescription>Students progress overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses?.slice(0, 5).map((course: Course) => (
                      <div key={course._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <Link to={`/instructor/courses/${course._id}`}>
                              <p className="text-sm font-medium text-gray-900">{course.title}</p>
                            </Link>
                            <p className="text-xs text-gray-500">
                              {course.students} students enrolled
                            </p>
                          </div>
                        </div>
                        <div className="w-1/4">
                          <Progress value={course.rating} className="h-2.5 rounded-full bg-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium text-blue-600">{course.rating}%</div>
                            </div>
                          </Progress>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex flex-col">
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Course Title</TableHead>
                      <TableHead className="whitespace-nowrap">Students</TableHead>
                      <TableHead className="whitespace-nowrap">Rating</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses?.map((course: Course) => (
                      <TableRow key={course._id} className="hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden">
                              <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <Link to={`/instructor/courses/${course._id}`}>
                                <p className="text-sm font-medium text-gray-900">{course.title}</p>
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {course.students}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{course.rating.toFixed(1)}</div>
                            <Star className="ml-1 h-4 w-4 text-yellow-500" />
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={course.status === 'published' ? 'success' : 'default'}>
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button 
                              as={Link} 
                              to={`/instructor/courses/${course._id}/edit`} 
                              variant="outline" 
                              size="icon"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setSelectedCourse(course._id);
                                setShowCreateCourse(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => {
                                setSelectedCourse(course._id);
                                setShowCreateCourse(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex flex-col">
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Student Name</TableHead>
                      <TableHead className="whitespace-nowrap">Email</TableHead>
                      <TableHead className="whitespace-nowrap">Progress</TableHead>
                      <TableHead className="whitespace-nowrap">Last Active</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.map((student: Student) => (
                      <TableRow key={student._id} className="hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=${student.name}`} alt={student.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{student.progress}%</div>
                            <div className="w-full h-2.5 rounded-full bg-gray-200 ml-2">
                              <div 
                                className="h-2.5 rounded-full bg-blue-600"
                                style={{ width: `${student.progress}%` }}
                               />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(student.lastActive), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button 
                              as={Link} 
                              to={`/instructor/students/${student._id}`} 
                              variant="outline" 
                              size="icon"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => {
                                setSelectedCourse(student._id);
                                setShowCreateCourse(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex flex-col">
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Assignment Title</TableHead>
                      <TableHead className="whitespace-nowrap">Course</TableHead>
                      <TableHead className="whitespace-nowrap">Student</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments?.map((assignment: Assignment) => (
                      <TableRow key={assignment._id} className="hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Link to={`/instructor/courses/${assignment.course}`}>
                            <p className="text-sm font-medium text-blue-600">
                              {courses?.find((c: Course) => c._id === assignment.course)?.title}
                            </p>
                          </Link>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Link to={`/instructor/students/${assignment.student}`}>
                            <p className="text-sm font-medium text-blue-600">
                              {students?.find((s: Student) => s._id === assignment.student)?.name}
                            </p>
                          </Link>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={assignment.status === 'graded' ? 'success' : 'default'}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button 
                              as={Link} 
                              to={`/instructor/assignments/${assignment._id}`} 
                              variant="outline" 
                              size="icon"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => {
                                setSelectedCourse(assignment._id);
                                setShowCreateCourse(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
                <CardDescription>Insights into course performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
                    <div className="text-xs font-medium text-gray-500 uppercase">Student Enrollment</div>
                    <div className="mt-2 flex-1">
                      <div className="text-3xl font-bold text-gray-900">{statsData.totalStudents}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        {statsData.activeStudents} active now
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={statsData.completionRate} className="h-2.5 rounded-full bg-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-blue-600">{statsData.completionRate}%</div>
                        </div>
                      </Progress>
                    </div>
                  </div>

                  <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
                    <div className="text-xs font-medium text-gray-500 uppercase">Revenue</div>
                    <div className="mt-2 flex-1">
                      <div className="text-3xl font-bold text-gray-900">${statsData.totalRevenue.toLocaleString()}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        Total earnings from courses
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={statsData.averageRating} className="h-2.5 rounded-full bg-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-blue-600">{statsData.averageRating.toFixed(1)}</div>
                        </div>
                      </Progress>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorDashboard;
