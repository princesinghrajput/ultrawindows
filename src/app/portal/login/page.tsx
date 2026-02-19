"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/portal/AuthLayout";
import FormInput from "@/components/portal/FormInput";
import PortalButton from "@/components/portal/PortalButton";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverTone, setServerTone] = useState<"info" | "warning" | "error">(
    "error",
  );

  const validateForm = () => {
    const validation = loginSchema.safeParse(formData);
    if (validation.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return false;
  };

  const mapAuthError = (code?: string, fallback?: string) => {
    switch (code) {
      case "account_rejected":
        setServerTone("warning");
        return "Your access request was rejected. Please contact support.";
      case "invalid_credentials":
        setServerTone("error");
        return "Invalid email or password.";
      default:
        setServerTone("error");
        return (
          fallback || "Authentication failed. Please try again."
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerMessage(null);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl: "/portal/dashboard",
    });

    setLoading(false);

    if (!result) {
      setServerMessage("Something unexpected happened.");
      return;
    }

    if (result.error) {
      setServerMessage(mapAuthError(result.code ?? undefined, result.error));
      return;
    }

    const refreshedSession = await getSession();

    if (refreshedSession?.user?.status === "pending") {
      setServerTone("warning");
      setServerMessage("Your account is still pending approval.");
      router.push("/portal/pending");
      return;
    }

    router.push(result.url ?? "/portal/dashboard");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Ultra Windows portal"
    >
      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {serverMessage && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${serverTone === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
          >
            {serverMessage}
          </div>
        )}

        <div className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div className="space-y-1">
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />

          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) =>
                setFormData({ ...formData, remember: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 group-hover:border-orange-400 transition-colors"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
          </label>
          <Link
            href="/portal/reset-password"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-all"
          >
            Forgot password?
          </Link>
        </div>

        <PortalButton type="submit" loading={loading} className="w-full text-base">
          Sign In
          <LogIn className="w-4 h-4 opacity-80" />
        </PortalButton>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider text-slate-400 font-medium">
            <span className="px-3 bg-white">New to Ultra Windows?</span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/portal/register">
            <PortalButton type="button" variant="secondary" className="w-full">
              Request Access
            </PortalButton>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
