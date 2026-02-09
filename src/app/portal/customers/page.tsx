"use client";

import { useState } from "react";
import { Search, Plus, Building2, Mail, Phone, MoreHorizontal, User } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";

interface Customer {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: string;
    lastOrder: string;
    status: "active" | "inactive";
}

// Mock customers data
const mockCustomers: Customer[] = [
    {
        id: "1",
        name: "John Smith",
        company: "ABC Construction Ltd",
        email: "john@abcconstruction.co.uk",
        phone: "+44 7700 900123",
        totalOrders: 24,
        totalSpent: "£45,250.00",
        lastOrder: "08/02/2024",
        status: "active",
    },
    {
        id: "2",
        name: "Sarah Johnson",
        company: "HomeStyle Properties",
        email: "sarah@homestyle.co.uk",
        phone: "+44 7700 900456",
        totalOrders: 18,
        totalSpent: "£32,100.00",
        lastOrder: "07/02/2024",
        status: "active",
    },
    {
        id: "3",
        name: "Mike Thompson",
        company: "Modern Builds UK",
        email: "mike@modernbuilds.co.uk",
        phone: "+44 7700 900789",
        totalOrders: 12,
        totalSpent: "£28,750.00",
        lastOrder: "06/02/2024",
        status: "active",
    },
    {
        id: "4",
        name: "Emma Wilson",
        company: "Premium Homes",
        email: "emma@premiumhomes.co.uk",
        phone: "+44 7700 900012",
        totalOrders: 8,
        totalSpent: "£15,400.00",
        lastOrder: "05/02/2024",
        status: "active",
    },
    {
        id: "5",
        name: "David Brown",
        company: "Sussex Windows Co",
        email: "david@sussexwindows.co.uk",
        phone: "+44 7700 900345",
        totalOrders: 45,
        totalSpent: "£82,300.00",
        lastOrder: "04/02/2024",
        status: "active",
    },
    {
        id: "6",
        name: "Lisa Taylor",
        company: "Budget Builds",
        email: "lisa@budgetbuilds.co.uk",
        phone: "+44 7700 900678",
        totalOrders: 3,
        totalSpent: "£4,200.00",
        lastOrder: "01/01/2024",
        status: "inactive",
    },
];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");

    const filteredCustomers = mockCustomers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout title="Customers">
            {/* Top Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all">
                    <Plus className="w-5 h-5" />
                    Add Customer
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "inactive")}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                    <div
                        key={customer.id}
                        className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                                    {customer.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-slate-500">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {customer.company}
                                    </div>
                                </div>
                            </div>
                            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {customer.phone}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div>
                                <p className="text-xs text-slate-400">Total Orders</p>
                                <p className="font-semibold text-slate-900">{customer.totalOrders}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Total Spent</p>
                                <p className="font-semibold text-slate-900">{customer.totalSpent}</p>
                            </div>
                            <div>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                        }`}
                                >
                                    {customer.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No customers found</p>
                </div>
            )}
        </DashboardLayout>
    );
}
