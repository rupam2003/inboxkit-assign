/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRef, useCallback, useState } from "react";
import { BlockComponent } from "./block-component";
import { motion } from "motion/react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./optics/button";

export const GridComponent = () => {
	const grid = useQuery(api.blocks.getGrid);
	const [scale, setScale] = useState(1);
	const containerRef = useRef<HTMLElement>(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const startY = useRef(0);
	const scrollLeft = useRef(0);
	const scrollTop = useRef(0);

	const onMouseDown = useCallback((e: React.MouseEvent) => {
		const el = containerRef.current;
		if (!el) return;
		isDragging.current = true;
		startX.current = e.clientX;
		startY.current = e.clientY;
		scrollLeft.current = el.scrollLeft;
		scrollTop.current = el.scrollTop;
		el.style.cursor = "grabbing";
		el.style.userSelect = "none";
	}, []);

	const onMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging.current) return;
		const el = containerRef.current;
		if (!el) return;
		const dx = e.clientX - startX.current;
		const dy = e.clientY - startY.current;
		el.scrollLeft = scrollLeft.current - dx;
		el.scrollTop = scrollTop.current - dy;
	}, []);

	const onMouseUp = useCallback(() => {
		isDragging.current = false;
		const el = containerRef.current;
		if (el) {
			el.style.cursor = "grab";
			el.style.removeProperty("user-select");
		}
	}, []);

	if (!grid)
		return (
			<div className="relative w-[95vw] lg:w-[calc(100vw-280px)] h-[96vh] my-[2vh] mx-auto border-5 border-card overflow-hidden " />
		);
	return (
		<motion.div
			initial={{ filter: "blur(10px)" }}
			animate={{ filter: "blur(0px)" }}
			transition={{ duration: 1 }}
			className="relative w-[95vw] lg:w-[calc(100vw-280px)] h-[96vh] my-[2vh] mx-auto border-5 border-card overflow-hidden "
		>
			{/* Fog overlays */}
			<div className="absolute top-0 left-0 right-0 h-10 bg-linear-to-b z-100 from-background to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t z-100 from-background to-transparent" />
			<div className="absolute top-0 left-0 bottom-0 w-10 bg-linear-to-r z-100 from-background to-transparent" />
			<div className="absolute top-0 right-0 bottom-0 w-10 bg-linear-to-l z-100 from-background to-transparent" />
			<p className="absolute z-100 top-1 left-2 text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-lg">
				Captured blocks will be released after 30 seconds
			</p>
			<p className="absolute z-100 bottom-1 left-2 text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-lg">
				Click and drag on the grid to move it around
			</p>
			<section
				ref={containerRef}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseUp}
				className="w-full h-full border bg-background overflow-scroll p-5 cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<div
					style={{ scale: scale }}
					className="w-[2600px] h-[1050px] transition-all p-5 gap-3 grid grid-cols-50 mx-auto"
				>
					{grid.map((block) => {
						return <BlockComponent key={block._id} block={block} />;
					})}
				</div>
				<div className="absolute z-100 bottom-0 right-0">
					<ZoomInOut scale={scale} setScale={setScale} />
				</div>
			</section>
		</motion.div>
	);
};

function ZoomInOut({
	scale,
	setScale,
}: {
	scale: number;
	setScale: (scale: number) => void;
}) {
	const handleZoom = (type: "in" | "out") => {
		const curr = Math.round(scale * 10) / 10;
		if (type === "in") {
			setScale(Math.round(Math.min(curr + 0.1, 1) * 10) / 10);
		} else {
			setScale(Math.round(Math.max(curr - 0.1, 0.5) * 10) / 10);
		}
	};
	return (
		<div className="border rounded-lg bg-card flex items-center gap-2">
			<Button variant="ghost" size="icon-lg" onClick={() => handleZoom("out")}>
				<ZoomOut />
			</Button>
			<p className="w-10 font-semibold">{scale * 100}%</p>
			<Button variant="ghost" size="icon-lg" onClick={() => handleZoom("in")}>
				<ZoomIn />
			</Button>
		</div>
	);
}
