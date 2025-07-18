import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ArrowRight } from "lucide-react";

const courses = [
  {
    title: "React & TypeScript Mastery",
    description: "Build modern web applications with React, TypeScript, and advanced patterns.",
    level: "Intermediate",
    duration: "12 weeks",
    students: "2,847",
    rating: "4.9",
    price: "$99",
    tags: ["React", "TypeScript", "Frontend"]
  },
  {
    title: "Full-Stack Web Development",
    description: "Complete web development bootcamp covering frontend, backend, and deployment.",
    level: "Beginner",
    duration: "16 weeks",
    students: "5,234",
    rating: "4.8",
    price: "$149",
    tags: ["JavaScript", "Node.js", "Full-Stack"]
  },
  {
    title: "AI & Machine Learning",
    description: "Dive into artificial intelligence and machine learning with Python.",
    level: "Advanced",
    duration: "10 weeks",
    students: "1,923",
    rating: "4.9",
    price: "$199",
    tags: ["Python", "AI", "Machine Learning"]
  }
];

export const FeaturedCourses = () => {
  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your learning journey with our most popular and highly-rated courses
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">{course.price}</span>
                  <Button variant="gradient" size="sm" className="group">
                    Enroll Now
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};