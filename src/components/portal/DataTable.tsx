"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import clsx from "clsx";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    loading?: boolean;
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
}

export default function DataTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = "No data found",
    loading = false,
    onRowClick,
    actions,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const getValue = (item: T, key: string) => {
        return (item as Record<string, unknown>)[key];
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = getValue(a, sortKey);
            const bVal = getValue(b, sortKey);
            if (aVal === bVal) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const comparison = aVal < bVal ? -1 : 1;
            return sortOrder === "asc" ? comparison : -comparison;
        });
    }, [data, sortKey, sortOrder]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={clsx(
                                        "px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider",
                                        col.sortable && "cursor-pointer hover:text-slate-700 select-none"
                                    )}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortOrder === "asc"
                                                ? <ChevronUp className="w-3 h-3" />
                                                : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider w-16">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-3">
                                            <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                                        </td>
                                    ))}
                                    {actions && <td className="px-4 py-3" />}
                                </tr>
                            ))
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center">
                                    <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500">{emptyMessage}</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    onClick={() => onRowClick?.(item)}
                                    className={clsx(
                                        "transition-colors",
                                        onRowClick ? "cursor-pointer hover:bg-slate-50" : "hover:bg-slate-50"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className={clsx("px-4 py-3 text-sm text-slate-700", col.className)}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : String(getValue(item, String(col.key)) ?? "-")}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right">{actions(item)}</td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded text-slate-500 hover:bg-white disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={clsx(
                                    "w-8 h-8 rounded text-sm font-medium",
                                    currentPage === page
                                        ? "bg-orange-500 text-white"
                                        : "text-slate-600 hover:bg-white"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded text-slate-500 hover:bg-white disabled:opacity-40"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Status Badge
export function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        draft: "bg-slate-100 text-slate-500",
        pending: "bg-amber-50 text-amber-600",
        approved: "bg-emerald-50 text-emerald-600",
        completed: "bg-emerald-50 text-emerald-600",
        processing: "bg-blue-50 text-blue-600",
        cancelled: "bg-red-50 text-red-600",
    };

    return (
        <span className={clsx("px-2 py-0.5 text-xs font-medium rounded", styles[status] || styles.draft)}>
            {status}
        </span>
    );
}
