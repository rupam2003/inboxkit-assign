import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getSecondsRemaining = (expiresAt: number) => {
	const now = Date.now();
	const remaining = expiresAt - now;
	return Math.floor(remaining / 1000);
};
