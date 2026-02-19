"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, User, Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/portal/AuthLayout";
import FormInput from "@/components/portal/FormInput";
import PortalButton from "@/components/portal/PortalButton";
import { registerSchema, type RegisterPayload } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterPayload>({
    fullName: "",
    email: "",
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
    parsed.error.issues.forEach((issue) => {
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

    try {
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

      // Optional: Auto redirect
      setTimeout(() => {
        const search = new URLSearchParams({ email: formData.email }).toString();
        router.push(`/portal/pending?${search}`);
      }, 3000);

    } catch (error) {
      setLoading(false);
      setServerMessage("Something went wrong. Please try again.");
    }
  };

  if (showSuccessState) {
    return (
      <AuthLayout
        title="Registration Successful"
        subtitle="Your account is under review"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center animate-in zoom-in duration-300">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">You're in the queue</h2>
            <p className="text-slate-600 leading-relaxed">
              Thanks for registering, <span className="font-semibold text-slate-900">{formData.fullName}</span>.
              Our team is reviewing your request. We'll email you at <span className="font-medium text-slate-900">{formData.email}</span> once approved.
            </p>
          </div>

          <div className="pt-6">
            <Link href="/portal/login">
              <PortalButton variant="secondary" className="w-full">
                Return to Login
              </PortalButton>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the portal to start managing your orders"
    >
      <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {serverMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
            {serverMessage}
          </div>
        )}

        <div className="space-y-4">
          <FormInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={<User className="w-5 h-5" />}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <FormInput
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Password"
              type="password"
              placeholder="Min 8 chars"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <FormInput
              label="Confirm"
              type="password"
              placeholder="Confirm password"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
            I agree to the <a href="#" className="text-slate-900 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-slate-900 font-medium hover:underline">Privacy Policy</a>
          </label>
        </div>
        {errors.terms && <p className="text-xs text-red-500 -mt-2 ml-7">{errors.terms}</p>}


        <PortalButton type="submit" loading={loading} className="w-full text-base">
          Create Account
          <ArrowRight className="w-4 h-4 opacity-80" />
        </PortalButton>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider text-slate-400 font-medium">
            <span className="bg-white px-3">Already a member?</span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/portal/login" className="text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors">
            Sign in to your account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
