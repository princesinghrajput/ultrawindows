"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/portal/AuthLayout";
import FormInput from "@/components/portal/FormInput";
import PortalButton from "@/components/portal/PortalButton";

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError("Email is required");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="We've sent password reset instructions"
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-slate-600">
                            If an account exists for <strong className="text-slate-900">{email}</strong>,
                            you will receive a password reset link shortly.
                        </p>
                        <p className="text-sm text-slate-500">
                            Please check your spam folder if you don&apos;t see the email.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Link href="/portal/login">
                            <PortalButton type="button">
                                Return to Sign In
                            </PortalButton>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setSubmitted(false);
                                setEmail("");
                            }}
                            className="w-full text-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Try a different email
                        </button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email and we'll send you a reset link"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="you@company.com"
                    icon={<Mail className="w-5 h-5" />}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                    error={error}
                />

                <PortalButton type="submit" loading={loading}>
                    Send Reset Link
                </PortalButton>

                <Link
                    href="/portal/login"
                    className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors pt-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                </Link>
            </form>
        </AuthLayout>
    );
}
