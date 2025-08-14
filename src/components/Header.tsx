import { Button } from "@/components/ui/button";
import { Code, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
	"Web3",
	"Graphics Design",
	"Front End Development",
	"Digital Marketing",
	"UI/UX Design",
	"Project Management",
];

export const Header = () => {
	return (
		<header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Code className="h-8 w-8 text-primary" />
						<span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
							Edel Tech City
						</span>
					</div>

					<nav className="hidden md:flex items-center space-x-8">
						<a
							href="#courses"
							className="text-foreground hover:text-primary transition-colors"
						>
							Courses
						</a>
						<a
							href="#features"
							className="text-foreground hover:text-primary transition-colors"
						>
							Features
						</a>
						<Link
							to="/dashboard"
							className="text-foreground hover:text-primary transition-colors"
						>
							Dashboard
						</Link>
					</nav>

					<div className="hidden md:flex items-center space-x-4">
						<Link to="/login">
							<Button variant="ghost" size="sm">
								Sign In
							</Button>
						</Link>
						<Button variant="hero" size="sm">
							Get Started
						</Button>
					</div>

					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
};

export const FeaturedCourses = () => (
	<div>
		<h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
			Available Courses
		</h2>
		<ul className="space-y-2">
			{courses.map((course) => (
				<li key={course} className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
					{course}
				</li>
			))}
		</ul>
	</div>
);