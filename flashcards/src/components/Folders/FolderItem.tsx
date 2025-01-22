import React from "react";
import { Folder } from "../../types/interfaces";
import { useDrop } from "react-dnd";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

interface FolderItemProps {
	folder: Folder;
	isActive: boolean;
	onClick: () => void;
	onDrop: (folderId: number, setId: number) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
	folder,
	isActive,
	onClick,
	onDrop,
}) => {
	const [{ isOver }, dropRef] = useDrop(() => ({
		accept: "flashcard-set",
		drop: (item: { id: number }) => {
			onDrop(folder.ID, item.id);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));

	return (
		<div
			ref={dropRef}
			className={`collapse collapse-arrow join-item bg-base rounded-box border-base ${
				!isOver ? "border-[1px]" : "border-[4px]"
			} ${isActive ? "border-[1px] border-l-blue-600" : ""}`}
		>
			<input
				type="checkbox"
				className="folder-accordion"
				checked={isActive}
				onChange={onClick}
			/>

			<div className="collapse-title text-xl flex font-medium justify-between">
				<div className="flex items-center">
					{isActive ? (
						<FaFolderOpen className="mr-2" />
					) : (
						<FaFolder className="mr-2" />
					)}
					<span>{folder.Name}</span>
				</div>
				<p>{folder.FlashcardsSets.length}</p>
			</div>

			<div className="collapse-content text-start">
				<p>{folder.Description}</p>
			</div>
		</div>
	);
};

export default FolderItem;
