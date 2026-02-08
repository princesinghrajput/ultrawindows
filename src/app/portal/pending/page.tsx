"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, LogOut, CheckCircle, Loader2 } from "lucide-react";
import PortalButton from "@/components/portal/PortalButton";

export default function PendingPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"pending" | "approved">("pending");
    const [countdown, setCountdown] = useState(12);

    // Auto-transition to approved after ~12 seconds
    useEffect(() => {
        if (status === "pending") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setStatus("approved");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status]);

    // Redirect to dashboard after approval
    useEffect(() => {
        if (status === "approved") {
            const timer = setTimeout(() => {
                router.push("/portal/dashboard");
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Link href="/portal/login" className="inline-flex items-center gap-3">
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={48}
                                height={48}
                                className="w-12 h-12"
                            />
                            <span className="text-xl font-heading font-bold text-slate-900">
                                Ultra Windows
                            </span>
                        </Link>
                    </div>

                    {status === "pending" ? (
                        <>
                            {/* Spinner */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-slate-100"></div>
                                    <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-orange-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                                    Account Pending Approval
                                </h1>
                                <p className="text-slate-600">
                                    Your account is currently awaiting approval from our staff
                                </p>
                            </div>

                            {/* Status Box */}
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                                <p className="text-sm text-amber-800 text-center">
                                    Your account has been created successfully, but requires
                                    approval before you can access the portal.
                                </p>
                            </div>

                            {/* What happens next */}
                            <div className="space-y-4 mb-6">
                                <h3 className="font-semibold text-slate-900">
                                    What happens next?
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        "A staff member will review your registration",
                                        "Once approved, you'll be able to access the portal",
                                        "This page will automatically refresh when you're approved",
                                        "You can safely close this window and come back later",
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 text-sm text-slate-600"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Timer indicator */}
                            <div className="text-center text-sm text-slate-500 mb-6">
                                <span className="inline-flex items-center gap-2">
                                    <span className="animate-pulse">●</span>
                                    Waiting for approval...
                                    <span className="text-xs text-slate-400">
                                        (demo: {countdown}s)
                                    </span>
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-once">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                                    Account Approved!
                                </h1>
                                <p className="text-slate-600">
                                    Your account has been approved. Redirecting to your
                                    dashboard...
                                </p>
                            </div>

                            {/* Status Box */}
                            <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-6">
                                <p className="text-sm text-green-800 text-center font-medium">
                                    Welcome to the Ultra Windows Customer Portal!
                                </p>
                            </div>

                            {/* Loading bar */}
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-progress"></div>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="border-t border-slate-100 pt-6 mt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                            <a
                                href="mailto:support@ultrawindows.co.uk"
                                className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Support
                            </a>

                            <Link href="/portal/login">
                                <PortalButton variant="ghost" fullWidth={false}>
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </PortalButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
