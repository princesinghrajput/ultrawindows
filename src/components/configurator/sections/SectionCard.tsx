import React from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 overflow-hidden transition-shadow duration-300 hover:shadow-md ${className}`}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(249,250,251,0.8), rgba(241,245,249,0.6))",
        }}
      >
        <div
          className="w-1 h-5 rounded-full shrink-0"
          style={{
            background: "linear-gradient(180deg, #f97316, #ea580c)",
          }}
        />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
