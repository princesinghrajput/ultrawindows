"use client";

import { useState } from "react";
import { Search, Calendar, Filter, MoreHorizontal } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import DataTable, { Column, StatusBadge } from "@/components/portal/DataTable";

interface Order {
    id: string;
    orderNumber: string;
    created: string;
    lastUpdated: string;
    channel: string;
    customer: string;
    reference: string;
    products: number;
    total: string;
    createdBy: string;
    status: "pending" | "approved" | "completed" | "cancelled";
}

// Mock all orders
const mockOrders: Order[] = [
    {
        id: "1",
        orderNumber: "O-2024-0025",
        created: "08/02/2024",
        lastUpdated: "08/02/2024",
        channel: "Trade Portal",
        customer: "ABC Construction Ltd",
        reference: "Project Alpha",
        products: 3,
        total: "£4,250.00",
        createdBy: "John Doe",
        status: "pending",
    },
    {
        id: "2",
        orderNumber: "O-2024-0024",
        created: "07/02/2024",
        lastUpdated: "08/02/2024",
        channel: "Trade Portal",
        customer: "HomeStyle Properties",
        reference: "Renovation 2024",
        products: 5,
        total: "£8,750.00",
        createdBy: "John Doe",
        status: "completed",
    },
    {
        id: "3",
        orderNumber: "O-2024-0023",
        created: "06/02/2024",
        lastUpdated: "07/02/2024",
        channel: "Website",
        customer: "Modern Builds UK",
        reference: "New Build Phase 2",
        products: 4,
        total: "£6,150.00",
        createdBy: "Jane Smith",
        status: "approved",
    },
    {
        id: "4",
        orderNumber: "O-2024-0022",
        created: "05/02/2024",
        lastUpdated: "06/02/2024",
        channel: "Trade Portal",
        customer: "Premium Homes",
        reference: "Kitchen Extension",
        products: 2,
        total: "£3,450.00",
        createdBy: "John Doe",
        status: "completed",
    },
    {
        id: "5",
        orderNumber: "O-2024-0021",
        created: "04/02/2024",
        lastUpdated: "05/02/2024",
        channel: "Phone",
        customer: "Sussex Windows Co",
        reference: "Stock Order Feb",
        products: 12,
        total: "£18,200.00",
        createdBy: "Jane Smith",
        status: "completed",
    },
    {
        id: "6",
        orderNumber: "O-2024-0020",
        created: "03/02/2024",
        lastUpdated: "03/02/2024",
        channel: "Trade Portal",
        customer: "Budget Builds",
        reference: "Cancelled Project",
        products: 1,
        total: "£1,250.00",
        createdBy: "John Doe",
        status: "cancelled",
    },
];

const columns: Column<Order>[] = [
    { key: "orderNumber", label: "Order Number", sortable: true },
    { key: "created", label: "Created", sortable: true },
    { key: "lastUpdated", label: "Last Updated", sortable: true },
    { key: "channel", label: "Channel" },
    { key: "customer", label: "Customer", sortable: true },
    { key: "reference", label: "Reference" },
    { key: "products", label: "Products", className: "text-center" },
    { key: "total", label: "Total", sortable: true, className: "font-semibold" },
    {
        key: "status",
        label: "Status",
        render: (order) => <StatusBadge status={order.status} />,
    },
];

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout title="View All Orders">
            {/* Top Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>

                    {/* Find by ID */}
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-sm">#</span>
                        <input
                            type="text"
                            placeholder="0001"
                            className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                        />
                        <button className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                            Find Order
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                        <option value="lastUpdated">Last Updated</option>
                        <option value="created">Created Date</option>
                        <option value="total">Total Value</option>
                        <option value="customer">Customer</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredOrders}
                keyExtractor={(order) => order.id}
                emptyMessage="No orders found"
                onRowClick={(order) => console.log("View order:", order.id)}
                actions={(order) => (
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                )}
            />
        </DashboardLayout>
    );
}
