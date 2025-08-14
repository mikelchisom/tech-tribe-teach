import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Users, Video, PlayCircle, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
  };
  scheduledAt: string;
  duration: number;
  platform: string;
  meetingLink: string;
  meetingId?: string;
  meetingPassword?: string;
  recordingLink?: string;
  status: string;
  maxParticipants: number;
  registeredStudents: Array<{
    student: {
      _id: string;
      name: string;
      email: string;
    };
    registeredAt: string;
    attended: boolean;
  }>;
}

const LiveClassDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  const { data: liveClass, isLoading, error } = useQuery({
    queryKey: ['liveClass', id],
    queryFn: async () => {
      const response = await fetch(`/api/live-classes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch live class');
      const data = await response.json();
      return data.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/live-classes/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveClass', id] });
      toast.success('Successfully registered for the live class');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const startClassMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/live-classes/${id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to start class');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveClass', id] });
      toast.success('Class started successfully');
    },
  });

  const endClassMutation = useMutation({
    mutationFn: async (recordingLink: string) => {
      const response = await fetch(`/api/live-classes/${id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recordingLink }),
      });
      if (!response.ok) throw new Error('Failed to end class');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveClass', id] });
      toast.success('Class ended successfully');
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load live class details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!liveClass) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Live class not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isRegistered = liveClass.registeredStudents.some(
    (reg: any) => reg.student._id === 'current-user-id' // Replace with actual user ID
  );

  const handleRegister = () => {
    registerMutation.mutate();
  };

  const handleStartClass = () => {
    startClassMutation.mutate();
  };

  const handleEndClass = () => {
    const recordingLink = prompt('Enter recording link (optional):');
    endClassMutation.mutate(recordingLink || '');
  };

  const handleJoinClass = () => {
    window.open(liveClass.meetingLink, '_blank');
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{liveClass.title}</h1>
            <p className="text-gray-600">{liveClass.description}</p>
          </div>
          <Badge className={getStatusColor(liveClass.status)}>
            {liveClass.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Class Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Scheduled Date</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(liveClass.scheduledAt), 'PPP')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">{liveClass.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Registered Students</p>
                    <p className="text-sm text-gray-600">
                      {liveClass.registeredStudents.length} / {liveClass.maxParticipants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Video className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Platform</p>
                    <p className="text-sm text-gray-600 capitalize">{liveClass.platform}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Meeting Link</p>
                    <a
                      href={liveClass.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {liveClass.meetingLink}
                    </a>
                  </div>
                </div>

                {liveClass.recordingLink && (
                  <div className="flex items-center">
                    <PlayCircle className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Recording</p>
                      <a
                        href={liveClass.recordingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Watch Recording
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Registered Students</CardTitle>
              </CardHeader>
              <CardContent>
                {liveClass.registeredStudents.length === 0 ? (
                  <p className="text-gray-600">No students registered yet</p>
                ) : (
                  <div className="space-y-2">
                    {liveClass.registeredStudents.map((registration: any) => (
                      <div
                        key={registration.student._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{registration.student.name}</p>
                          <p className="text-sm text-gray-600">{registration.student.email}</p>
                        </div>
                        <Badge variant={registration.attended ? 'default' : 'secondary'}>
                          {registration.attended ? 'Attended' : 'Registered'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveClass.status === 'scheduled' && !isRegistered && (
                  <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Registering...' : 'Register for Class'}
                  </Button>
                )}

                {liveClass.status === 'live' && (
                  <Button
                    className="w-full"
                    onClick={handleJoinClass}
                    variant="default"
                  >
                    Join Live Class
                  </Button>
                )}

                {liveClass.status === 'completed' && liveClass.recordingLink && (
                  <Button
                    className="w-full"
                    onClick={() => window.open(liveClass.recordingLink, '_blank')}
                    variant="outline"
                  >
                    Watch Recording
                  </Button>
                )}

                {liveClass.status === 'scheduled' && (
                  <Button
                    className="w-full"
                    onClick={handleStartClass}
                    disabled={startClassMutation.isPending}
                  >
                    {startClassMutation.isPending ? 'Starting...' : 'Start Class'}
                  </Button>
                )}

                {liveClass.status === 'live' && (
                  <Button
                    className="w-full"
                    onClick={handleEndClass}
                    disabled={endClassMutation.isPending}
                    variant="destructive"
                  >
                    {endClassMutation.isPending ? 'Ending...' : 'End Class'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{liveClass.instructor.name}</p>
                <p className="text-sm text-gray-600">{liveClass.instructor.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{liveClass.course.title}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassDetails;
