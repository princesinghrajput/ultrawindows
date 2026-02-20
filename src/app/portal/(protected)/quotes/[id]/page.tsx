"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil, Download, Repeat2 } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import { StatusBadge } from "@/components/portal/DataTable";
import VisualizerPanel from "@/components/configurator/VisualizerPanel";
import DimensionsSection from "@/components/configurator/sections/DimensionsSection";
import PriceSummary from "@/components/configurator/PriceSummary";
import type { Quote, QuoteItem } from "@/types/quote";
import type { ProductConfig } from "@/types/product";
import type { PriceBreakdown } from "@/utils/pricing";

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
        month: "short",
        year: "numeric",
    });
};

const deriveItems = (quote: Quote | null): QuoteItem[] => {
    if (!quote) return [];
    if (quote.items?.length) return quote.items;
    if (quote.productType && quote.configuration) {
        return [
            {
                productType: quote.productType,
                configuration: quote.configuration,
                priceBreakdown: quote.priceBreakdown,
                quantity: quote.quantity ?? 1,
                location: quote.location,
                netPrice: quote.netPrice,
                totalPrice: quote.totalPrice,
            } as QuoteItem,
        ];
    }
    return [];
};

const QuoteDetailPage = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const routeId = params?.id;
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [view, setView] = useState<"inside" | "outside">("outside");

    useEffect(() => {
        const idParam = Array.isArray(routeId) ? routeId.join("/") : routeId;
        if (!idParam) return;
        let active = true;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const response = await fetch(`/api/quotes/${idParam}`);
                if (!response.ok) {
                    throw new Error("Unable to load quote");
                }
                const data: Quote = await response.json();
                if (!active) return;
                setQuote(data);
                setSelectedIndex(0);
            } catch (err) {
                if (!active) return;
                setError(err instanceof Error ? err.message : "Failed to load quote");
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [routeId]);

    const items = useMemo(() => deriveItems(quote), [quote]);
    const selectedItem = items[selectedIndex] || items[0] || null;
    const priceBreakdown = selectedItem?.priceBreakdown || quote?.priceBreakdown || null;
    const resolvedPriceBreakdown = priceBreakdown as PriceBreakdown | null;

    const handleEdit = () => {
        if (!quote) return;
        router.push(`/configurator?quoteId=${quote.quoteId}`);
    };

    const handleConvert = () => {
        alert("Order conversion flow coming soon.");
    };

    const handleDownload = () => {
        alert("PDF export coming soon.");
    };

    if (loading) {
        return (
            <DashboardLayout title="Quote">
                <div className="flex h-[50vh] items-center justify-center text-slate-400">
                    Loading quote...
                </div>
            </DashboardLayout>
        );
    }

    if (error || !quote) {
        return (
            <DashboardLayout title="Quote">
                <div className="max-w-lg mx-auto text-center bg-white border border-slate-200 rounded-xl p-6">
                    <p className="text-sm text-slate-600">{error || "Quote not found"}</p>
                    <button
                        onClick={() => router.push("/portal/quotes")}
                        className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800"
                    >
                        Back to quotes
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={`Quote ${quote.quoteId}`}>
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <StatusBadge status={quote.status} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Created</p>
                        <p className="text-base font-medium text-slate-900">{formatDate(quote.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Expires</p>
                        <p className="text-base font-medium text-slate-900">{formatDate(quote.expiryDate)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Quote
                        </button>
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={handleConvert}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50"
                        >
                            <Repeat2 className="w-4 h-4" />
                            Convert to Order
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {selectedItem?.configuration ? (
                            <>
                                <div className="w-full lg:w-1/2">
                                    <VisualizerPanel
                                        config={selectedItem.configuration as ProductConfig}
                                        view={view}
                                        onToggleView={() =>
                                            setView((prev) =>
                                                prev === "outside" ? "inside" : "outside",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <DimensionsSection
                                        config={selectedItem.configuration as ProductConfig}
                                        onUpdate={() => undefined}
                                        validation={{ isValid: true }}
                                        isSidelightModalOpen={false}
                                        onOpenSidelightModal={() => undefined}
                                        onCloseSidelightModal={() => undefined}
                                        readOnly
                                    />
                                    {resolvedPriceBreakdown && (
                                        <div className="border border-slate-200 rounded-xl p-4">
                                            <PriceSummary breakdown={resolvedPriceBreakdown} />
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="w-full border border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                                Configuration snapshot unavailable for this quote.
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-2">Items</p>
                        {items.length === 0 ? (
                            <div className="border border-dashed border-slate-200 rounded-lg px-4 py-6 text-center text-sm text-slate-500">
                                No items were stored with this quote.
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {items.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedIndex(index)}
                                        className={`flex justify-between items-center px-4 py-3 rounded-lg border text-left transition-colors ${index === selectedIndex
                                                ? "border-orange-400 bg-orange-50"
                                                : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 capitalize">
                                                {item.productType}
                                            </p>
                                            <p className="text-xs text-slate-500">{item.location || "General"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {formatCurrency(item.totalPrice)}
                                            </p>
                                            <p className="text-xs text-slate-500">Qty {item.quantity ?? 1}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4">Customer Details</h3>
                        <dl className="space-y-3 text-sm text-slate-600">
                            <div>
                                <dt className="font-medium">Name</dt>
                                <dd>{quote.customerDetails?.name || "-"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Email</dt>
                                <dd>{quote.customerDetails?.email || "-"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Phone</dt>
                                <dd>{quote.customerDetails?.phone || "-"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Address</dt>
                                <dd className="whitespace-pre-wrap">
                                    {quote.customerDetails?.address || "-"}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4">Financial Summary</h3>
                        <dl className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center justify-between">
                                <dt>Net Total</dt>
                                <dd className="font-medium">{formatCurrency(quote.netTotal ?? selectedItem?.netPrice)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt>Tax</dt>
                                <dd className="font-medium">{formatCurrency(quote.taxTotal ?? 0)}</dd>
                            </div>
                            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                                <dt>Gross Total</dt>
                                <dd>{formatCurrency(quote.grossTotal ?? selectedItem?.totalPrice)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default QuoteDetailPage;
