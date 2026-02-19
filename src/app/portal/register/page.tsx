"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/portal/AuthLayout";
import FormInput from "@/components/portal/FormInput";
import PortalButton from "@/components/portal/PortalButton";
import {
  registerSchema,
  type RegisterPayload,
} from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterPayload>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [showSuccessState, setShowSuccessState] = useState(false);

  const validateForm = () => {
    const parsed = registerSchema.safeParse(formData);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const nextErrors: Record<string, string> = {};
    parsed.error.errors.forEach((issue) => {
      if (issue.path[0]) {
        nextErrors[issue.path[0] as string] = issue.message;
      }
    });
    setErrors(nextErrors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerMessage(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setServerMessage(payload?.message ?? "Unable to submit your request.");
      return;
    }

    setShowSuccessState(true);
    setServerMessage(null);

    setTimeout(() => {
      router.push("/portal/pending");
    }, 1800);
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

  if (showSuccessState) {
    return (
      <AuthLayout
        title="Request Received"
        subtitle="Thanks for submitting your details"
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-9 h-9 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            You're in the queue
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Our onboarding team is reviewing your access request. This usually
            takes a few hours during business days.
          </p>
          <p className="text-sm text-slate-500">
            We&apos;ll email you once your portal access has been approved.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Request Customer Portal Access"
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

        {serverMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {serverMessage}
          </div>
        )}

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
