"use client";

import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Brand Panel - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 portal-gradient relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full" />
                    <div className="absolute top-40 right-10 w-60 h-60 border border-white/10 rounded-full" />
                    <div className="absolute bottom-20 left-10 w-80 h-80 border border-white/5 rounded-full" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div>
                        <Link href="/portal/login" className="inline-flex items-center gap-3">
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={48}
                                height={48}
                                className="w-12 h-12"
                            />
                            <span className="text-2xl font-heading font-bold text-white">
                                Ultra Windows
                            </span>
                        </Link>
                    </div>

                    {/* Main Message */}
                    <div className="space-y-6">
                        <h1 className="text-4xl xl:text-5xl font-heading font-bold text-white leading-tight">
                            Customer Portal
                        </h1>
                        <p className="text-lg text-white/80 max-w-md leading-relaxed">
                            Access your quotes, track orders, and manage your account all in
                            one place.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 pt-4">
                            {[
                                "View and manage quotes",
                                "Track order status",
                                "Access product catalog",
                                "Direct support access",
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                                        <svg
                                            className="w-3.5 h-3.5 text-orange-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-white/90">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-white/60 text-sm">
                        © {new Date().getFullYear()} Ultra Windows & Bifolds Ltd. All rights
                        reserved.
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/portal/login" className="inline-flex items-center gap-3">
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={40}
                                height={40}
                                className="w-10 h-10"
                            />
                            <span className="text-xl font-heading font-bold text-slate-900">
                                Ultra Windows
                            </span>
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="mt-2 text-slate-600 text-sm sm:text-base">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Form Content */}
                        {children}
                    </div>

                    {/* Back to site link */}
                    <div className="text-center mt-6">
                        <Link
                            href="/portal/login"
                            className="text-sm text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1.5"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Ultra Windows
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
