"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Loader, SidebarClose, SidebarOpen } from "lucide-react";
import React, { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/optics/button";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const LeftSidebar = () => {
	const [open, setOpen] = React.useState(false);
	useEffect(() => {
		if (window.innerWidth >= 1024) {
			setOpen(true);
		}
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setOpen(true);
			} else {
				setOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	return (
		<>
			<div
				className={cn(
					"z-200 bg-background absolute lg:relative h-screen border-r overflow-x-hidden duration-200",
					open
						? "w-[250px] min-w-[250px] max-w-[250px]"
						: "w-0 min-w-0 max-w-0 px-0",
				)}
			>
				<div className="p-4 h-[calc(100%-160px)] overflow-y-scroll">
					<TopConquerersList />
				</div>
				<UserProfile />

				<Button
					size={"icon"}
					className="absolute top-2 right-2 hover:bg-card! hover:text-white/80"
					variant="ghost"
					onClick={() => setOpen(false)}
				>
					<SidebarClose />
				</Button>
			</div>

			<Button
				size={"icon"}
				className="fixed top-2 left-2 z-100 hover:bg-card! hover:text-white/80"
				variant="ghost"
				onClick={() => setOpen(true)}
			>
				<SidebarOpen />
			</Button>
		</>
	);
};

const UserProfile = () => {
	const { signOut } = useAuthActions();
	const user = useQuery(api.users.getCurrentUser);
	const [loading, setLoading] = React.useState(false);
	const changeColor = useMutation(api.users.changeColor);
	const handleColorChange = async (color: string) => {
		try {
			setLoading(true);
			await changeColor({ color });
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (user?.color) {
			setColor(user.color);
		}
	}, [user?.color]);
	const [color, setColor] = React.useState("#000000");
	if (user === undefined || user === null) {
		return <div className="w-full h-10 border-t"></div>;
	}
	return (
		<div className="w-full text-sm h-[160px] border-t p-4 flex flex-col ">
			<p className="text-nowrap text-ellipsis overflow-hidden">{user.name}</p>
			<p className="text-muted text-nowrap text-ellipsis overflow-hidden mb-2">
				{user.email}
			</p>
			<div className="mb-2 flex items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<div
							style={{
								backgroundColor: color || "#ffffff",
							}}
							className=" h-full w-8 aspect-square rounded-lg cursor-pointer border"
						></div>
					</PopoverTrigger>
					<PopoverContent className="z-200 flex w-full p-4">
						<HexColorPicker color={color} onChange={setColor} />
					</PopoverContent>
				</Popover>
				<Button
					disabled={loading}
					variant="muted"
					className="flex-1 "
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
						e.preventDefault();
						handleColorChange(color);
					}}
				>
					{loading ? <Loader className="h-4 w-4 animate-spin" /> : "Update"}
				</Button>
			</div>

			<Button
				size="lg"
				variant="destructive"
				onClick={() => signOut()}
				className="text-xs h-8 p-4"
			>
				Sign Out
			</Button>
		</div>
	);
};

function TopConquerersList() {
	const topConquerers = useQuery(api.users.getTopConquerers);
	return (
		<section className="text-muted w-full text-nowrap overflow-hidden ">
			<h1 className="font-bold text-lg mb-5 text-primary">Top Conquerers</h1>
			{topConquerers?.length === 0 && (
				<p className="text-muted text-center font-semibold text-sm">
					No conquerers found.
					<br />
					Looks like the grid is empty.
				</p>
			)}
			{topConquerers?.map((conquerer) => (
				<div className="flex justify-between" key={conquerer.userId}>
					<p className="text-sm max-w-[100px] truncate font-medium">
						{conquerer.user?.name ?? "Unknown"}
					</p>
					<div className="text-sm flex items-center gap-1 font-medium">
						<p
							style={{ backgroundColor: conquerer.user?.color }}
							className="w-4 h-4 rounded-sm"
						></p>
						{conquerer.count}
					</div>
				</div>
			))}
		</section>
	);
}
