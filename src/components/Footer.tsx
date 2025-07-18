import { Code, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TechLearn
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering the next generation of developers with cutting-edge technology education.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Courses</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary transition-colors">Web Development</a>
              <a href="#" className="block hover:text-primary transition-colors">Mobile Development</a>
              <a href="#" className="block hover:text-primary transition-colors">Data Science</a>
              <a href="#" className="block hover:text-primary transition-colors">DevOps</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="block hover:text-primary transition-colors">Community</a>
              <a href="#" className="block hover:text-primary transition-colors">Blog</a>
              <a href="#" className="block hover:text-primary transition-colors">Help Center</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary transition-colors">About Us</a>
              <a href="#" className="block hover:text-primary transition-colors">Careers</a>
              <a href="#" className="block hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 TechLearn. All rights reserved. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
};