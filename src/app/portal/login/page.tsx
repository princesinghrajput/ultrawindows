"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/portal/AuthLayout";
import FormInput from "@/components/portal/FormInput";
import PortalButton from "@/components/portal/PortalButton";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pendingMessage, setPendingMessage] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setPendingMessage(false);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock: Show pending message for demo, or redirect to dashboard
        if (formData.email.includes("pending")) {
            setPendingMessage(true);
            setLoading(false);
        } else {
            router.push("/portal/dashboard");
        }
    };

    return (
        <AuthLayout
            title="Sign In"
            subtitle="Enter your credentials to access your portal"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {pendingMessage && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-amber-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-800">
                                    Account Pending Approval
                                </p>
                                <p className="text-sm text-amber-700 mt-0.5">
                                    Your account is awaiting approval. You will gain access once
                                    our team verifies your request.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="you@company.com"
                    icon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                />

                <FormInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    error={errors.password}
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.remember}
                            onChange={(e) =>
                                setFormData({ ...formData, remember: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link
                        href="/portal/reset-password"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <PortalButton type="submit" loading={loading}>
                    Sign In
                </PortalButton>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">
                            New to the portal?
                        </span>
                    </div>
                </div>

                <Link href="/portal/register">
                    <PortalButton type="button" variant="secondary">
                        Request Access
                    </PortalButton>
                </Link>
            </form>
        </AuthLayout>
    );
}
