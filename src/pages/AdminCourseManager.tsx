import React, { useState } from "react";

const initialCourses = [
	{
		id: 1,
		title: "Web3",
		difficulty: "Intermediate",
		prerequisites: [],
		modules: [
			{
				name: "Blockchain Basics",
				topics: [
					{ name: "Intro to Blockchain", type: "video", file: "blockchain.mp4" },
					{ name: "PDF Notes", type: "pdf", file: "blockchain.pdf" },
				],
			},
		],
	},
];

export default function AdminCourseManager() {
	const [courses, setCourses] = useState(initialCourses);
	const [showModules, setShowModules] = useState<{ [key: number]: boolean }>({});

	// Example add/edit/delete handlers (implement as needed)
	const addCourse = () => {
		setCourses([
			...courses,
			{
				id: Date.now(),
				title: "New Course",
				difficulty: "Beginner",
				prerequisites: [],
				modules: [],
			},
		]);
	};

	const deleteCourse = (id: number) => {
		setCourses(courses.filter((c) => c.id !== id));
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<h1 className="text-2xl font-bold mb-6">Admin Course Management</h1>
			<button
				className="mb-4 px-4 py-2 bg-primary text-white rounded"
				onClick={addCourse}
			>
				Add Course
			</button>
			<div className="space-y-6">
				{courses.map((course) => (
					<div key={course.id} className="bg-white rounded shadow p-4">
						<div className="flex justify-between items-center">
							<div>
								<h2 className="text-xl font-bold">{course.title}</h2>
								<span className="text-sm text-muted-foreground">
									Difficulty: {course.difficulty}
								</span>
								{course.prerequisites.length > 0 && (
									<div className="text-xs mt-1">
										Prerequisites: {course.prerequisites.join(", ")}
									</div>
								)}
							</div>
							<div>
								<button
									className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded"
									// onClick={() => editCourse(course.id)}
								>
									Edit
								</button>
								<button
									className="px-3 py-1 bg-red-500 text-white rounded"
									onClick={() => deleteCourse(course.id)}
								>
									Delete
								</button>
								<button
									className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
									onClick={() =>
										setShowModules((prev) => ({
											...prev,
											[course.id]: !prev[course.id],
										}))
									}
								>
									{showModules[course.id] ? "Hide Modules" : "Show Modules"}
								</button>
							</div>
						</div>
						{/* Collapsible Modules */}
						{showModules[course.id] && (
							<div className="mt-4">
								{course.modules.length === 0 ? (
									<div className="text-muted-foreground">No modules yet.</div>
								) : (
									course.modules.map((mod, idx) => (
										<div key={idx} className="mb-4">
											<h3 className="font-semibold">{mod.name}</h3>
											<ul className="ml-4 list-disc">
												{mod.topics.map((topic, tIdx) => (
													<li key={tIdx}>
														{topic.name} ({topic.type}){" "}
														<a
															href={`/${topic.file}`}
															className="text-primary underline ml-2"
															target="_blank"
															rel="noopener noreferrer"
														>
															Download
														</a>
													</li>
												))}
											</ul>
										</div>
									))
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}