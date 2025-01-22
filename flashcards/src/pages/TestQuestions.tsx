import { useQuery, useMutation } from "@tanstack/react-query";
import { getTestQuestions, verifyAnswers } from "../requests/test";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import TestScoreModal from "../components/TestScoreModal";

const TestQuestions: React.FC = () => {
	const navigate = useNavigate();
	const { testId } = useParams<{ testId: string }>();

	const {
		data: testQuestions,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["test_questions"],
		queryFn: () => getTestQuestions(testId!),
		enabled: !!testId,
		staleTime: Infinity,
	});

	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: number]: string;
	}>({});

	const questionRefs = useRef<any[]>([]);

	const handleAnswerSelect = (questionId: number, answer: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: answer,
		}));
	};

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState<any>(null);
	const handleCloseModal = () => {
		navigate("/tests");
		setIsModalVisible(false);
	};
	const { mutate } = useMutation({
		mutationFn: (answers: { [key: number]: string }) =>
			verifyAnswers(answers),
		onSuccess: (data: {
			correct: number;
			incorrect: number;
			total: number;
		}) => {
			setModalContent(data);
			setIsModalVisible(true);
			console.log("Answers submitted successfully:", data);
		},
		onError: (error) => {
			console.error("Error submitting answers:", error);
		},
	});

	const handleVerify = () => {
		const answersToSubmit = testQuestions.reduce(
			(acc: { [key: number]: string }, question: any) => {
				acc[question.id] = selectedAnswers[question.id] || "";
				return acc;
			},
			{}
		);

		const payload = {
			testID: testId,
			answers: answersToSubmit,
		};

		mutate(payload);
	};

	if (isLoading) {
		return (
			<div className="flex p-4 max-w-5xl w-full mx-auto">
				Test Is Loading
			</div>
		);
	}
	// Handle loading and error states
	if (error) {
		const errorMessage = error;
		return <p>{String(errorMessage)}</p>;
	}

	// Scroll to the specific question
	const handleQuestionClick = (index: number) => {
		questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="flex p-4 max-w-5xl w-full mx-auto">
			{/* Sidebar with list of questions */}
			<div className="pr-4 sticky top-1/4 h-screen transform overflow-y-auto">
				<ul className="space-y-4">
					{testQuestions?.map((question: any, index: number) => (
						<li
							key={question.id}
							className="cursor-pointer hover:text-blue-500"
							onClick={() => handleQuestionClick(index)}
						>
							{`Question ${index + 1}`}
						</li>
					))}
				</ul>
			</div>

			{/* Main content with questions */}
			<div className="w-3/4">
				{testQuestions?.map((question: any, index: number) => (
					<div
						key={question.id}
						className="mb-8"
						ref={(el) => (questionRefs.current[index] = el)}
					>
						<div className="modal-box max-w-7xl w-full rounded-3xl flex items-center justify-center h-80">
							<h3 className="text-3xl font-semibold text-center">
								{question.question_text}
							</h3>
						</div>

						<div className="grid mx-16 grid-cols-2 mt-4 gap-2">
							{question.possible_answers.map(
								(answer: string, idx: number) => (
									<div
										key={idx}
										className={`p-4 border-[1px] text-center rounded-3xl transition cursor-pointer ${
											selectedAnswers[question.id] ===
											answer
												? "bg-blue-500 text-white"
												: "bg-base-100 hover:bg-gray-200"
										}`}
										onClick={() =>
											handleAnswerSelect(
												question.id,
												answer
											)
										}
									>
										{answer}
									</div>
								)
							)}
						</div>
					</div>
				))}

				{/* Verify button */}
				<div className="text-center mt-8">
					<button
						className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
						onClick={handleVerify}
					>
						Verify
					</button>
				</div>
			</div>
			<TestScoreModal
				isVisible={isModalVisible}
				onClose={handleCloseModal}
				title="Results"
				content={modalContent}
			/>
		</div>
	);
};

export default TestQuestions;
