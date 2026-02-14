import type { Metadata } from "next";
import { Doto, Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
const geistSans = IBM_Plex_Sans({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const doto = Doto({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Grid",
	description: "A multiplayer block capturing game",
	icons: {
		icon: "/grid.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en">
				<body
					className={`${geistSans.className} ${doto.variable} font-sans antialiased dark`}
				>
					<ConvexClientProvider>{children}</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	);
}
