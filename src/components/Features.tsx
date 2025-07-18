import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Video, 
  Users, 
  Award, 
  Code2, 
  Zap,
  Target,
  Globe
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Hands-on coding exercises and real-world projects to reinforce your learning."
  },
  {
    icon: Video,
    title: "HD Video Content",
    description: "High-quality video lectures with clear explanations and practical demonstrations."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a vibrant community of learners and get help from peers and instructors."
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn industry-recognized certificates upon successful course completion."
  },
  {
    icon: Code2,
    title: "Code Reviews",
    description: "Get personalized feedback on your code from experienced developers."
  },
  {
    icon: Zap,
    title: "Fast-Track Learning",
    description: "Accelerated learning paths designed to get you job-ready quickly."
  },
  {
    icon: Target,
    title: "Career-Focused",
    description: "Curriculum designed with input from hiring managers and industry leaders."
  },
  {
    icon: Globe,
    title: "Learn Anywhere",
    description: "Access your courses from any device, anywhere in the world."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">TechLearn</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to succeed in your tech career journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm hover:bg-primary/5">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};