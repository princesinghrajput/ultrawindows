"use client";

import { useState } from "react";
import { Search, Calendar, MoreHorizontal, Package } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import DataTable, { Column, StatusBadge } from "@/components/portal/DataTable";

interface Order {
    id: string;
    orderNumber: string;
    created: string;
    customer: string;
    reference: string;
    products: number;
    total: string;
    status: "pending" | "approved" | "completed" | "cancelled" | "processing";
}

const mockOrders: Order[] = [
    { id: "1", orderNumber: "O-2024-0025", created: "08/02/2024", customer: "ABC Construction Ltd", reference: "Project Alpha", products: 3, total: "£4,250.00", status: "pending" },
    { id: "2", orderNumber: "O-2024-0024", created: "07/02/2024", customer: "HomeStyle Properties", reference: "Renovation 2024", products: 5, total: "£8,750.00", status: "completed" },
    { id: "3", orderNumber: "O-2024-0023", created: "06/02/2024", customer: "Modern Builds UK", reference: "New Build Phase 2", products: 4, total: "£6,150.00", status: "processing" },
    { id: "4", orderNumber: "O-2024-0022", created: "05/02/2024", customer: "Premium Homes", reference: "Kitchen Extension", products: 2, total: "£3,450.00", status: "completed" },
    { id: "5", orderNumber: "O-2024-0021", created: "04/02/2024", customer: "Sussex Windows Co", reference: "Stock Order Feb", products: 12, total: "£18,200.00", status: "completed" },
];

const columns: Column<Order>[] = [
    {
        key: "orderNumber",
        label: "Order",
        sortable: true,
        render: (order) => (
            <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-slate-400" />
                <div>
                    <p className="font-medium text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-400">{order.reference}</p>
                </div>
            </div>
        )
    },
    { key: "customer", label: "Customer", sortable: true },
    { key: "created", label: "Date", sortable: true },
    { key: "products", label: "Items", className: "text-center" },
    { key: "total", label: "Total", sortable: true, className: "font-medium" },
    {
        key: "status",
        label: "Status",
        render: (order) => <StatusBadge status={order.status} />,
    },
];

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout title="Orders">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search orders..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input type="date" className="bg-transparent text-sm focus:outline-none" />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredOrders}
                keyExtractor={(order) => order.id}
                emptyMessage="No orders found"
                onRowClick={(order) => console.log("View order:", order.id)}
                actions={(order) => (
                    <button className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                )}
            />
        </DashboardLayout>
    );
}
