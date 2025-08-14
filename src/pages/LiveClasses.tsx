import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Users, Video, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

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
  recordingLink?: string;
  registeredStudents: Array<{
    student: string;
    registeredAt: string;
  }>;
}

const LiveClasses: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('upcoming');

  const { data: liveClasses = [], isLoading } = useQuery({
    queryKey: ['liveClasses', filter],
    queryFn: async () => {
      const response = await fetch(`/api/live-classes?${filter !== 'all' ? `upcoming=${filter === 'upcoming'}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch live classes');
      const data = await response.json();
      return data.data;
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return <Video className="h-4 w-4" />;
      case 'google-meet':
        return <PlayCircle className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Live Classes & Webinars</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'live' ? 'default' : 'outline'}
            onClick={() => setFilter('live')}
          >
            Live Now
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {liveClasses.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No live classes found</h3>
          <p className="text-gray-600">Check back later for new live classes and webinars.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((liveClass: LiveClass) => (
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
                    {getPlatformIcon(liveClass.platform)}
                    {liveClass.platform}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/live-classes/${liveClass._id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                {liveClass.status === 'scheduled' && (
                  <Button variant="default">Register</Button>
                )}
                {liveClass.status === 'live' && (
                  <Button variant="default">Join Now</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveClasses;
