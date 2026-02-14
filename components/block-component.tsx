import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";

type Props = {
	block: FunctionReturnType<typeof api.blocks.getGrid>[number];
};

export const BlockComponent = ({ block }: Props) => {
	const user = useQuery(api.users.getCurrentUser);
	const captureBlock = useMutation(api.blocks.captureBlock);
	const color = block.user?.color || "#000000";
	const [isCapturing, setIsCapturing] = useState(false);
	const handleCapture = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsCapturing(true);
		await captureBlock({
			blockId: block._id,
		});
		setIsCapturing(false);
	};
	if (!user) return null;
	// for optimisitic UI update
	if (isCapturing) {
		return (
			<div
				style={{ backgroundColor: user.color }}
				className="relative  border hover:scale-110 transition-all "
				key={block._id}
			></div>
		);
	}
	return (
		<>
			{block.userId ? (
				<div
					style={{ backgroundColor: color }}
					className={`group flex justify-center items-center transition-all border relative hover:scale-110`}
					key={block._id}
				>
					{block.user && (
						<div className="bg-card min-w-24 border text-xs font-medium absolute bottom-10 scale-0 group-hover:scale-100 group-hover:opacity-100 opacity-0 p-2 transition-all duration-200">
							<p className="text-muted-foreground">Captured by</p>
							<p>{block.user.name ?? "Anonymous"}</p>
						</div>
					)}
				</div>
			) : (
				<button
					type="button"
					onClick={handleCapture}
					className="bg-card border hover:scale-110 transition-all "
					key={block._id}
				></button>
			)}
		</>
	);
};
