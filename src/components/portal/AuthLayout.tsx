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
            {/* Brand Panel - Hidden on mobile, fixed width on desktop */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative overflow-hidden bg-slate-900">
                {/* Modern Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/40 via-slate-900 to-slate-950"></div>

                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-all duration-300">
                                <Image
                                    src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                    alt="Ultra Windows"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 opacity-90"
                                />
                            </div>
                            <span className="text-2xl font-heading font-bold text-white tracking-tight">
                                Ultra<span className="text-orange-500">Windows</span>
                            </span>
                        </Link>
                    </div>

                    {/* Main Message */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl xl:text-5xl font-heading font-bold text-white leading-[1.15] tracking-tight">
                                Build better with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                                    Ultra Precision
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                                Streamline your workflow with our dedicated trade portal.
                                Quote, order, and track in real-time.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            {[
                                { title: "Instant Quotes", desc: "Get pricing in seconds, not days" },
                                { title: "Order Tracking", desc: "Real-time updates on your deliveries" },
                                { title: "Technical Library", desc: "Access specs and installation guides" },
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start gap-4 group/item">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/item:border-orange-500/50 group-hover/item:bg-orange-500/10 transition-colors">
                                        <svg className="w-4 h-4 text-slate-400 group-hover/item:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                                        <p className="text-slate-500 text-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
                        <span>© {new Date().getFullYear()} Ultra Windows</span>
                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Image
                            src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                            alt="Ultra Windows"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                        <span className="text-lg font-heading font-bold text-slate-900">
                            Ultra Windows
                        </span>
                    </Link>
                </div>

                <div className="w-full max-w-[420px] space-y-10">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-500 text-base">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Form Content */}
                    {children}

                    {/* Footer Links */}
                    <div className="pt-8 text-center border-t border-slate-100 space-y-6">
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                            <a href="#" className="hover:text-slate-900">Terms</a>
                            <a href="#" className="hover:text-slate-900">Privacy</a>
                            <a href="#" className="hover:text-slate-900">Help</a>
                        </div>

                        {/* Back to site link */}
                        <div className="text-center">
                            <Link
                                href="/portal/login"
                                className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5"
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
        </div>
    );
}
