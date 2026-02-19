"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Mail, Lock } from "lucide-react";
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
    validation.error.errors.forEach((issue) => {
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
        return "Your access request was rejected. Please contact support for next steps.";
      case "invalid_credentials":
        setServerTone("error");
        return "The email or password you entered is incorrect.";
      default:
        setServerTone("error");
        return (
          fallback ||
          "We couldn't sign you in right now. Please try again in a few moments."
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
      setServerMessage(
        "Something unexpected happened while signing you in. Please try again.",
      );
      return;
    }

    if (result.error) {
      setServerMessage(mapAuthError(result.code ?? undefined, result.error));
      return;
    }

    const refreshedSession = await getSession();

    if (refreshedSession?.user?.status === "pending") {
      setServerTone("warning");
      setServerMessage(
        "Your account is awaiting approval. We'll notify you as soon as the review is complete.",
      );
      router.push("/portal/pending");
      return;
    }

    router.push(result.url ?? "/portal/dashboard");
  };

  return (
    <AuthLayout
      title="Customer Portal"
      subtitle="Enter your approved credentials to access the dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {serverMessage && (
          <div
            className={`p-4 rounded-xl border ${serverTone === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
          >
            <p className="text-sm font-medium">{serverMessage}</p>
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
          Log in
        </PortalButton>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">
              Need portal credentials?
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
