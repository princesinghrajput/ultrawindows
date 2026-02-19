"use client";

import { useState } from "react";
import { Search, Plus, Building2, Mail, Phone, MoreHorizontal, Users } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";

interface Customer {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: string;
    status: "active" | "inactive";
}

const mockCustomers: Customer[] = [
    { id: "1", name: "John Smith", company: "ABC Construction Ltd", email: "john@abcconstruction.co.uk", phone: "+44 7700 900123", totalOrders: 24, totalSpent: "£45,250", status: "active" },
    { id: "2", name: "Sarah Johnson", company: "HomeStyle Properties", email: "sarah@homestyle.co.uk", phone: "+44 7700 900456", totalOrders: 18, totalSpent: "£32,100", status: "active" },
    { id: "3", name: "Mike Thompson", company: "Modern Builds UK", email: "mike@modernbuilds.co.uk", phone: "+44 7700 900789", totalOrders: 12, totalSpent: "£28,750", status: "active" },
    { id: "4", name: "Emma Wilson", company: "Premium Homes", email: "emma@premiumhomes.co.uk", phone: "+44 7700 900012", totalOrders: 8, totalSpent: "£15,400", status: "active" },
    { id: "5", name: "David Brown", company: "Sussex Windows Co", email: "david@sussexwindows.co.uk", phone: "+44 7700 900345", totalOrders: 45, totalSpent: "£82,300", status: "active" },
    { id: "6", name: "Lisa Taylor", company: "Budget Builds", email: "lisa@budgetbuilds.co.uk", phone: "+44 7700 900678", totalOrders: 3, totalSpent: "£4,200", status: "inactive" },
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
        <DashboardLayout
            title="Customers"
            actions={
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Customer
                </button>
            }
        >
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "inactive")}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                    <div
                        key={customer.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                                    {customer.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">{customer.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-slate-500">
                                        <Building2 className="w-3 h-3" />
                                        {customer.company}
                                    </div>
                                </div>
                            </div>
                            <button className="p-1.5 rounded text-slate-400 hover:bg-slate-100">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {customer.phone}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="text-sm">
                                <span className="text-slate-500">Orders:</span>{" "}
                                <span className="font-medium text-slate-900">{customer.totalOrders}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-500">Spent:</span>{" "}
                                <span className="font-medium text-slate-900">{customer.totalSpent}</span>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${customer.status === "active"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-slate-100 text-slate-500"
                                }`}>
                                {customer.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">No customers found</p>
                </div>
            )}
        </DashboardLayout>
    );
}
