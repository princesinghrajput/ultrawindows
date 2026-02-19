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
            className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
        >
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    {title}
                </h3>
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}
