"use client";

import { Inter, Montserrat } from "next/font/google";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    display: "swap",
});

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${inter.variable} ${montserrat.variable} font-sans antialiased min-h-screen bg-slate-50`}
        >
            {children}
        </div>
    );
}
