"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2, Mail, Phone, Lock } from "lucide-react";
import AuthLayout from "@/components/portal/AuthLayout";
import FormInput from "@/components/portal/FormInput";
import PortalButton from "@/components/portal/PortalButton";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.company.trim()) {
            newErrors.company = "Company name is required";
        }

        if (!formData.email) {
            newErrors.email = "Work email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.terms) {
            newErrors.terms = "You must agree to the terms";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Redirect to pending page
        router.push("/portal/pending");
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { label: "Weak", color: "bg-red-500" },
            { label: "Fair", color: "bg-orange-500" },
            { label: "Good", color: "bg-yellow-500" },
            { label: "Strong", color: "bg-green-500" },
        ];

        return { strength, ...levels[Math.min(strength - 1, 3)] };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <AuthLayout
            title="Request Access"
            subtitle="Submit your details and our team will activate your account"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 mb-2">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        <span className="font-medium text-slate-700">Note:</span> This
                        portal is restricted to verified customers. Your request will be
                        reviewed by our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Full Name"
                        type="text"
                        placeholder="John Smith"
                        icon={<User className="w-5 h-5" />}
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                        }
                        error={errors.fullName}
                    />

                    <FormInput
                        label="Company Name"
                        type="text"
                        placeholder="Acme Ltd"
                        icon={<Building2 className="w-5 h-5" />}
                        value={formData.company}
                        onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                        }
                        error={errors.company}
                    />
                </div>

                <FormInput
                    label="Work Email"
                    type="email"
                    placeholder="you@company.com"
                    icon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                />

                <FormInput
                    label="Phone Number"
                    type="tel"
                    placeholder="+44 7700 900000"
                    icon={<Phone className="w-5 h-5" />}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={errors.phone}
                />

                <FormInput
                    label="Create Password"
                    type="password"
                    placeholder="At least 8 characters"
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    error={errors.password}
                />

                {formData.password && (
                    <div className="space-y-1.5">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength
                                        ? passwordStrength.color
                                        : "bg-slate-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500">
                            Password strength:{" "}
                            <span className="font-medium">{passwordStrength.label}</span>
                        </p>
                    </div>
                )}

                <FormInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter your password"
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    error={errors.confirmPassword}
                />

                <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.terms}
                            onChange={(e) =>
                                setFormData({ ...formData, terms: e.target.checked })
                            }
                            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-600 leading-relaxed">
                            I agree to the{" "}
                            <a
                                href="#"
                                className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5">
                            <svg
                                className="w-4 h-4 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {errors.terms}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <PortalButton type="submit" loading={loading}>
                        Submit Access Request
                    </PortalButton>
                </div>

                <p className="text-center text-sm text-slate-600 pt-2">
                    Already have an account?{" "}
                    <Link
                        href="/portal/login"
                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
