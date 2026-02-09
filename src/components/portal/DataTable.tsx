"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const comparison = aVal < bVal ? -1 : 1;
        return sortOrder === "asc" ? comparison : -comparison;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getValue = (item: T, key: string) => {
        return (item as Record<string, unknown>)[key];
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={clsx(
                                        "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider",
                                        col.sortable && "cursor-pointer hover:bg-slate-100",
                                        col.className
                                    )}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortOrder === "asc" ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center"
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-slate-500">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    onClick={() => onRowClick?.(item)}
                                    className={clsx(
                                        "transition-colors",
                                        onRowClick
                                            ? "cursor-pointer hover:bg-orange-50/50"
                                            : "hover:bg-slate-50"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className={clsx(
                                                "px-4 py-4 text-sm text-slate-700",
                                                col.className
                                            )}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : String(getValue(item, String(col.key)) ?? "-")}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-4 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-600">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={clsx(
                                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                                        currentPage === page
                                            ? "bg-orange-500 text-white"
                                            : "text-slate-600 hover:bg-white"
                                    )}
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Status Badge Component
export function StatusBadge({
    status,
}: {
    status: "draft" | "pending" | "approved" | "completed" | "cancelled";
}) {
    const styles = {
        draft: "bg-slate-100 text-slate-600",
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                styles[status]
            )}
        >
            {status}
        </span>
    );
}
