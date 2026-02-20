"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Mail, LogOut, RefreshCcw, ShieldCheck } from "lucide-react";
import PortalButton from "@/components/portal/PortalButton";

function PendingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedEmail = searchParams.get("email");
  const { data: session, status: sessionStatus, update } = useSession();
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const sessionPending = session?.user?.status === "pending";

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (session?.user?.status === "approved") {
      router.replace("/portal/dashboard");
      return;
    }
    if (!session?.user && !requestedEmail) {
      router.replace("/portal/login");
    }
  }, [session, sessionStatus, requestedEmail, router]);

  const refreshStatus = useCallback(
    async (silent = false) => {
      if (!sessionPending || checking) return;

      setChecking(true);
      if (!silent) setFeedback(null);

      try {
        const res = await fetch("/api/portal/status", {
          method: "GET",
          headers: { "cache-control": "no-store" },
        });

        if (!res.ok) {
          throw new Error("Unable to refresh status.");
        }

        const data = await res.json();
        setLastChecked(new Date());

        if (data.status === "approved" && session) {
          await update({
            ...session,
            user: { ...session.user, status: "approved" },
          });
          router.replace("/portal/dashboard");
        } else if (!silent) {
          setFeedback(
            "Still pending review. We'll notify you as soon as it's approved.",
          );
        }
      } catch (error) {
        if (!silent) {
          setFeedback(
            "We couldn't reach the server. Please try again or contact support.",
          );
        }
      } finally {
        setChecking(false);
      }
    },
    [checking, router, session, sessionPending, update],
  );

  useEffect(() => {
    if (!sessionPending) return;
    const id = setInterval(() => refreshStatus(true), 30000);
    return () => clearInterval(id);
  }, [sessionPending, refreshStatus]);

  const renderStatusPanel = () => {
    const emailLabel =
      session?.user?.email || requestedEmail || "your work email";

    return (
      <>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
            Account Pending Approval
          </h1>
          <p className="text-slate-600">
            We&apos;re reviewing <span className="font-medium">{emailLabel}</span>
            {" "}and will enable access shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Account Status
            </p>
            <p className="text-lg font-semibold text-amber-600 mt-1">
              Pending Review
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Approvals typically take a few business hours.
            </p>
            {lastChecked && (
              <p className="text-xs text-slate-400 mt-3">
                Last checked at{" "}
                {lastChecked.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            We&apos;ll email you as soon as the portal unlocks. You can close this
            page—your progress is saved.
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
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

          {renderStatusPanel()}

          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-slate-900">What happens next?</h3>
            <ul className="space-y-3">
              {[
                "Our onboarding team verifies your business details.",
                "Once approved, the portal unlocks instantly.",
                "You'll receive an email confirmation right away.",
                "Need to make changes? Reply to the confirmation email.",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {feedback && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600 mb-4">
              {feedback}
            </div>
          )}

          {sessionPending && (
            <PortalButton
              type="button"
              loading={checking}
              onClick={() => refreshStatus(false)}
            >
              <RefreshCcw className="w-4 h-4" />
              Check Status Again
            </PortalButton>
          )}

          {!sessionPending && (
            <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600">
                Once your approval email arrives, return here to sign in and access
                the dashboard.
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <a
                href="mailto:support@ultrawindows.co.uk"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>

              {session?.user ? (
                <PortalButton
                  type="button"
                  variant="ghost"
                  fullWidth={false}
                  onClick={() => signOut({ callbackUrl: "/portal/login" })}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </PortalButton>
              ) : (
                <Link href="/portal/login">
                  <PortalButton variant="ghost" fullWidth={false}>
                    Return to Login
                  </PortalButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="text-slate-500">Loading...</div>
        </div>
      }
    >
      <PendingPageContent />
    </Suspense>
  );
}
