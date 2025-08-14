import React, { useState } from "react";

const courses = [
	{
		title: "Web3",
		materials: ["Intro to Blockchain", "Smart Contracts", "DApps"],
	},
	{
		title: "Graphics Design",
		materials: ["Photoshop Basics", "Illustrator Essentials", "Branding"],
	},
	{
		title: "Front End Development",
		materials: ["HTML & CSS", "JavaScript", "React Fundamentals"],
	},
	{
		title: "Digital Marketing",
		materials: ["SEO", "Social Media", "Analytics"],
	},
	{
		title: "UI/UX Design",
		materials: ["UI Principles", "UX Research", "Prototyping"],
	},
	{
		title: "Project Management",
		materials: ["Agile", "Scrum", "Leadership"],
	},
];

const Courses = () => {
	const [selected, setSelected] = useState(0);

	return (
		<div className="min-h-screen bg-background flex flex-col md:flex-row">
			{/* Courses List */}
			<aside className="w-full md:w-1/3 p-6 bg-white shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Courses</h2>
				<ul>
					{courses.map((course, idx) => (
						<li key={course.title}>
							<button
								className={`w-full text-left p-3 mb-2 rounded font-semibold ${
									selected === idx
										? "bg-primary text-white"
										: "bg-gray-100 hover:bg-primary/10"
								}`}
								onClick={() => setSelected(idx)}
							>
								{course.title}
							</button>
						</li>
					))}
				</ul>
			</aside>

			{/* Course Material Section */}
			<main className="flex-1 p-6">
				<h3 className="text-xl font-bold mb-2">
					{courses[selected].title} Materials
				</h3>
				<ul className="list-disc pl-6">
					{courses[selected].materials.map((mat) => (
						<li key={mat} className="mb-2 text-lg">
							{mat}
						</li>
					))}
				</ul>
			</main>
		</div>
	);
};

export default Courses;