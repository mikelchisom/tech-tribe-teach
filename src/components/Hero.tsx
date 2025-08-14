import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-tech-learning.jpg";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-24 pb-12 min-h-screen flex items-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Technology
                </span>{" "}
                Skills for the Future
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Learn programming, web development, and cutting-edge technologies
                through interactive courses designed by industry experts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>50+ Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Expert Instructors</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Link to="/login">
                <button
                  style={{
                    fontWeight: "bold",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Technology Learning Platform"
                className="w-full h-auto rounded-2xl shadow-card transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-3xl transform scale-110"></div>
          </div>
        </div>
      </div>
    </section>
  );
};