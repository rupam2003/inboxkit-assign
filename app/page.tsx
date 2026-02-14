"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { GridComponent } from "@/components/grid-component";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LeftSidebar } from "@/components/left-sidebar";

export default function Home() {
	return (
		<div className="w-screen h-screen ">
			<div className="flex">
				<LeftSidebar />
				<GridComponent />
			</div>
		</div>
	);
}
