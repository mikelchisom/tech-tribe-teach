import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';

const liveClassSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  courseId: z.string().min(1, 'Course is required'),
  scheduledAt: z.date({
    required_error: 'Scheduled date is required',
  }),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  platform: z.enum(['zoom', 'google-meet', 'custom']),
  meetingLink: z.string().url('Please enter a valid URL'),
  meetingId: z.string().optional(),
  meetingPassword: z.string().optional(),
  maxParticipants: z.number().min(1).max(1000),
});

type LiveClassFormData = z.infer<typeof liveClassSchema>;

interface LiveClassFormProps {
  liveClass?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LiveClassForm: React.FC<LiveClassFormProps> = ({ liveClass, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LiveClassFormData>({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      title: liveClass?.title || '',
      description: liveClass?.description || '',
      courseId: liveClass?.course?._id || '',
      scheduledAt: liveClass ? new Date(liveClass.scheduledAt) : new Date(),
      duration: liveClass?.duration || 60,
      platform: liveClass?.platform || 'zoom',
      meetingLink: liveClass?.meetingLink || '',
      meetingId: liveClass?.meetingId || '',
      meetingPassword: liveClass?.meetingPassword || '',
      maxParticipants: liveClass?.maxParticipants || 100,
    },
  });

  const onSubmit = async (data: LiveClassFormData) => {
    setIsSubmitting(true);
    try {
      const url = liveClass ? `/api/live-classes/${liveClass._id}` : '/api/live-classes';
      const method = liveClass ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save live class');
      }

      toast.success(liveClass ? 'Live class updated successfully' : 'Live class created successfully');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter class title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this class will cover"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="course1">Web Development Fundamentals</SelectItem>
                  <SelectItem value="course2">React Advanced Concepts</SelectItem>
                  <SelectItem value="course3">UI/UX Design Principles</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Scheduled Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select when this live class will take place
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="15"
                  max="480"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                How long will this class run?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="custom">Custom Platform</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Which platform will you use for this live class?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://zoom.us/j/123456789"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The URL students will use to join the live class
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="123 456 789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Password (Optional)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Participants</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Maximum number of students who can register
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Saving...' : (liveClass ? 'Update Class' : 'Create Class')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LiveClassForm;
