import React from "react";

interface ModalProps {
	isVisible: boolean;
	onClose: () => void;
	title?: string;
	content?: any;
}

const TestScoreModal: React.FC<ModalProps> = ({
	isVisible,
	onClose,
	content,
}) => {
	if (!isVisible) return null;

	// Calculate score percentage based on content
	let scorePercentage = 0;
	if (content && content.correct !== undefined && content.total) {
		scorePercentage = Math.round((content.correct / content.total) * 100);
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
				{/* Title */}
				<h2 className="text-xl font-semibold">Results from Test</h2>

				{/* Radial Progress */}
				{content && content.correct !== undefined && (
					<div className="flex justify-center mt-4">
						<div
							className="radial-progress text-blue-500 border-primary"
							style={
								{
									"--value": scorePercentage,
									"--size": "12rem",
									"--thickness": "1rem",
								} as React.CSSProperties
							}
							role="progressbar"
						>
							{scorePercentage}%
						</div>
					</div>
				)}
				<div>
					{content.correct} / {content.total} Correct answers
				</div>

				{/* Close Button */}
				<div className="text-center">
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default TestScoreModal;
