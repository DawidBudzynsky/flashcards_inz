import React from "react";

interface CardContainerProps {
	children: React.ReactNode;
	className?: string;
}

const PageContainer: React.FC<CardContainerProps> = ({
	children,
	className,
}) => {
	return (
		<div
			className={`w-full border-[1px] h-lvh rounded-3xl my-4 p-4 bg-base-100 ${className}`}
		>
			{children}
		</div>
	);
};

export default PageContainer;
