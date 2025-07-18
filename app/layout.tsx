import type { Metadata } from "next";
import { Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

//import context
import SidebarProvider from "../context/Sidebar";

//import component
import Sidebar from "./components/Sidebar";
import MainContentWrapper from "./components/MainContentWrapper";

//font
const notoSans = Noto_Sans_Lao({
    subsets: ["lao", "latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "BitAI",
    description: "BitAI for everyone",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <SidebarProvider>
                <body
                    className={`${notoSans.className} bg-gray-900 text-white`}
                >
                    <main className="flex h-screen">
                        <Sidebar />
                        <MainContentWrapper>{children}</MainContentWrapper>
                    </main>
                </body>
            </SidebarProvider>
        </html>
    );
}
