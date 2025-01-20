const LoginPage: React.FC = () => {
	const features = [
		{
			title: "Master Your Knowledge with Flashcards",
			text: "Organize your learning with flashcards, rate your progress, and master any subject using our powerful revision system.",
			align: "start",
		},
		{
			title: "Personalized Learning with SM2 Algorithm",
			text: "Boost your memory retention with the SM2 algorithm that intelligently decides when it's time to review a flashcard.",
			align: "end",
		},
		{
			title: "Organize Your Learning in Folders and Sets",
			text: "Create and manage folders to organize your flashcards into sets for easy access and efficient study.",
			align: "start",
		},
		{
			title: "Track Your Progress with Intelligent Review Scheduling",
			text: "The app tracks your flashcards and schedules revisions based on how well you know them, ensuring a perfect study routine.",
			align: "end",
		},
		{
			title: "Create and Share Tests",
			text: "Create custom tests for yourself or share them with others, making studying and learning more collaborative and interactive.",
			align: "start",
		},
		{
			title: "Never Forget a Fact Again",
			text: "Leverage spaced repetition to ensure you’re always revising the flashcards you need, exactly when you need to.",
			align: "end",
		},
		{
			title: "Flashcards Made Easy and Effective",
			text: "Design flashcards, track your learning, and access a personalized revision schedule that adapts to your progress.",
			align: "start",
		},
		{
			title: "Study Smart, Not Hard",
			text: "Our app uses the SM2 algorithm to make sure you’re revising just the right flashcards at the right time for maximum retention.",
			align: "end",
		},
	];

	const keywords = [
		"Flashcards",
		"SM2",
		"folders",
		"sets",
		"revision",
		"memory",
		"study",
	];

	const highlightKeywords = (text: string) => {
		return text.split(" ").map((word, index) => {
			if (
				keywords.some((keyword) =>
					word.toLowerCase().includes(keyword.toLowerCase())
				)
			) {
				return (
					<span
						key={index}
						className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent animate-gradient-text"
					>
						{` ${word}`}
					</span>
				);
			}
			return " " + word;
		});
	};

	return (
		<div className="grid grid-rows-[auto_1fr_auto] h-screen p-6">
			<div className="self-center mx-auto max-w-4xl space-y-6">
				<h2 className="text-5xl font-bold text-center mb-4">
					<span>Welcome to the </span>
					<span className="text-blue-600 underline">
						Flashcard App
					</span>
				</h2>

				{features.map((feature, index) => (
					<div
						key={index}
						className={`max-w-[80%] ${
							feature.align === "end" ? "ml-auto" : ""
						} shadow-xl p-8 rounded-2xl text-${feature.align}`}
					>
						<p className="text-3xl">
							<strong>{highlightKeywords(feature.title)}</strong>
						</p>
						<p>{highlightKeywords(feature.text)}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default LoginPage;
