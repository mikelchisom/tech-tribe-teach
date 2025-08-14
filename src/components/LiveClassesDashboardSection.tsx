import React from 'react';
import { Calendar, Clock, Users, Video, PlayCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  registeredStudents: Array<{
    student: string;
    registeredAt: string;
  }>;
}

interface LiveClassesDashboardSectionProps {
  liveClasses: LiveClass[];
  isLoading?: boolean;
}

const LiveClassesDashboardSection: React.FC<LiveClassesDashboardSectionProps> = ({
  liveClasses = [],
  isLoading = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'live':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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

  const upcomingClasses = liveClasses.filter(cls => 
    ['scheduled', 'live'].includes(cls.status)
  ).slice(0, 3); // Show only 3 upcoming classes in dashboard

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Live Classes</h2>
        <Link to="/live-classes">
          <Button variant="outline" size="sm">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {upcomingClasses.length === 0 ? (
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
          {upcomingClasses.map((liveClass: LiveClass) => (
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
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Link to={`/live-classes/${liveClass._id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                  {liveClass.status === 'scheduled' && (
                    <Button variant="default" size="sm">Register</Button>
                  )}
                  {liveClass.status === 'live' && (
                    <Button variant="default" size="sm">Join Now</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveClassesDashboardSection;
