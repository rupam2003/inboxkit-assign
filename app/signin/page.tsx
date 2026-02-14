/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/optics/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SignIn() {
	const { signIn } = useAuthActions();
	const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	return (
		<div className="flex flex-col gap-8 w-full max-w-lg mx-auto h-screen justify-center items-center px-4">
			<div className={cn("text-center flex flex-col items-center")}>
				<figure className="relative w-10 h-10 bg-card mb-4 rounded-lg">
					<Image src="/grid.png" alt="Logo" fill className="p-2 rounded-lg" />
				</figure>
				<h1 className="text-3xl font-bold font-mono text-primary">
					WELCOME TO THE GRID
				</h1>
			</div>
			<form
				className="flex flex-col gap-4 w-full p-8 py-4 rounded-2xl"
				onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
					e.preventDefault();
					setLoading(true);
					setError(null);
					const formData = new FormData(e.target as HTMLFormElement);
					formData.set("flow", flow);
					void signIn("password", formData)
						.catch((error) => {
							setError(error.message);
							setLoading(false);
						})
						.then(() => {
							router.push("/");
						});
				}}
			>
				{flow === "signUp" && (
					<Input
						autoComplete="off"
						type="text"
						name="name"
						placeholder="Name"
						required
					/>
				)}
				<Input
					autoComplete="off"
					type="email"
					name="email"
					placeholder="Email"
					required
				/>
				<div className="flex flex-col gap-1">
					<Input
						autoComplete="off"
						type="password"
						name="password"
						placeholder="Password"
						minLength={8}
						required
					/>
					{flow === "signUp" && (
						<p className="text-xs px-1">
							Password must be at least 8 characters
						</p>
					)}
				</div>
				<Button type="submit" disabled={loading}>
					{loading ? "Loading..." : flow === "signIn" ? "Sign in" : "Sign up"}
				</Button>
				<div className="flex flex-row gap-2 text-muted font-medium text-sm justify-center items-center">
					<span className="">
						{flow === "signIn"
							? "Don't have an account?"
							: "Already have an account?"}
					</span>
					<Button
						variant="link"
						className="font-medium  cursor-pointer transition-colors"
						onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
					>
						{flow === "signIn" ? "Sign up" : "Sign in"}
					</Button>
				</div>
				{error && (
					<div className="bg-rose-500/10 border border-rose-500/30 dark:border-rose-500/50 rounded-lg p-4">
						<p className="text-rose-700 dark:text-rose-300 font-medium text-sm break-words">
							Error: Something went wrong. Please try again.
						</p>
					</div>
				)}
			</form>
		</div>
	);
}
