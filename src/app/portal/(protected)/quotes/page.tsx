"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreHorizontal, FileText } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import DataTable, { Column, StatusBadge } from "@/components/portal/DataTable";
import ProductModal from "@/components/portal/ProductModal";
import type { Quote } from "@/types/quote";
import type { ProductConfig } from "@/types/product";

const formatCurrency = (value?: number | null) => {
    const amount = typeof value === "number" ? value : 0;
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const getItemCount = (quote: Quote) => {
    if (quote.items?.length) {
        return quote.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    }
    return quote.configuration ? 1 : 0;
};

const getTotalAmount = (quote: Quote) =>
    quote.grossTotal ?? quote.totalPrice ?? quote.netTotal ?? quote.netPrice ?? 0;

const getLocation = (quote: Quote) => {
    if (quote.location) return quote.location;
    if (quote.items?.[0]?.location) return quote.items[0].location as string;
    const configuration = quote.configuration as (ProductConfig & { location?: string }) | null;
    return configuration?.location || "-";
};

const columns: Column<Quote>[] = [
    {
        key: "quoteId",
        label: "Quote",
        sortable: true,
        render: (quote) => (
            <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                    <p className="font-medium text-slate-900">{quote.quoteId}</p>
                    <p className="text-xs text-slate-400">{getLocation(quote)}</p>
                </div>
            </div>
        ),
    },
    {
        key: "customer",
        label: "Customer",
        render: (quote) => (
            <div>
                <p className="text-sm text-slate-900 font-medium">
                    {quote.customerDetails?.name || "-"}
                </p>
                {quote.customerDetails?.email && (
                    <p className="text-xs text-slate-400">{quote.customerDetails.email}</p>
                )}
            </div>
        ),
    },
    {
        key: "createdAt",
        label: "Created",
        sortable: true,
        render: (quote) => <span>{formatDate(quote.createdAt)}</span>,
    },
    {
        key: "items",
        label: "Items",
        className: "text-center",
        render: (quote) => <span>{getItemCount(quote)}</span>,
    },
    {
        key: "total",
        label: "Total",
        className: "font-medium",
        render: (quote) => <span>{formatCurrency(getTotalAmount(quote))}</span>,
    },
    {
        key: "status",
        label: "Status",
        render: (quote) => <StatusBadge status={quote.status} />,
    },
];

const STATUS_CARDS = [
    { key: "draft", label: "Draft" },
    { key: "pending", label: "Pending" },
    { key: "ordered", label: "Ordered" },
    { key: "archived", label: "Archived" },
] as const;

export default function QuotesPage() {
    const router = useRouter();
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        const controller = new AbortController();
        const loadQuotes = async () => {
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams();
                if (debouncedSearch) params.set("search", debouncedSearch);
                if (statusFilter) params.set("status", statusFilter);
                const url = params.size ? `/api/quotes?${params.toString()}` : "/api/quotes";
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error("Failed to fetch quotes");
                }
                const data: Quote[] = await response.json();
                setQuotes(data);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Failed to load quotes");
            } finally {
                setLoading(false);
            }
        };

        loadQuotes();
        return () => controller.abort();
    }, [debouncedSearch, statusFilter]);

    const statusSummary = useMemo(() =>
        STATUS_CARDS.map((card) => {
            const relatedQuotes = quotes.filter((quote) => quote.status === card.key);
            const count = relatedQuotes.length;
            const total = relatedQuotes.reduce((sum, quote) => sum + getTotalAmount(quote), 0);
            return { ...card, count, total };
        }),
        [quotes]
    );

    const handleProductSelect = (product: { id: string; name: string }) => {
        router.push(`/configurator?type=${product.id}`);
    };

    return (
        <DashboardLayout
            title="Quotes"
            actions={
                <button
                    onClick={() => setProductModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Quote
                </button>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {statusSummary.map((card) => (
                    <div key={card.key} className="bg-white border border-slate-200 rounded-xl p-4">
                        <p className="text-xs uppercase text-slate-500">{card.label}</p>
                        <p className="text-2xl font-semibold text-slate-900">{card.count}</p>
                        <p className="text-xs text-slate-400">{formatCurrency(card.total)}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search quotes..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="ordered">Ordered</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {error && (
                <div className="mb-4 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-sm text-red-600">
                    {error}
                </div>
            )}

            <DataTable
                columns={columns}
                data={quotes}
                loading={loading}
                keyExtractor={(quote) => quote._id || quote.quoteId}
                emptyMessage={loading ? "Loading quotes..." : "No quotes found"}
                onRowClick={(quote) => router.push(`/portal/quotes/${quote.quoteId}`)}
                actions={(quote) => (
                    <button
                        className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label={`Actions for ${quote.quoteId}`}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                )}
            />

            <ProductModal
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSelect={handleProductSelect}
            />
        </DashboardLayout>
    );
}
