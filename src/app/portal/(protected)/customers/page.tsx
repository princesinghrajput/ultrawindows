"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Building2, Mail, Phone, MoreHorizontal, Users, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import AddCustomerModal from "@/components/portal/customers/AddCustomerModal";

interface Company {
    _id: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    pricingType: string;
    createdAt: string;
}

export default function CustomersPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            if (res.ok) {
                const data = await res.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleCreateCustomer = async (data: any) => {
        try {
            const res = await fetch("/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                fetchCompanies(); // Refresh list
            } else {
                console.error("Failed to create customer");
            }
        } catch (error) {
            console.error("Error creating customer", error);
        }
    };

    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (company.contactName && company.contactName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <DashboardLayout
            title="Customers"
            actions={
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
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
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredCompanies.map((company) => (
                            <div
                                key={company._id}
                                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                                            {company.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-900">{company.name}</h3>
                                            {company.contactName && (
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <User className="w-3 h-3" />
                                                    {company.contactName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button className="p-1.5 rounded text-slate-400 hover:bg-slate-100">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-3">
                                    {company.email && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {company.email}
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            {company.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div className="text-sm">
                                        <span className="text-slate-500">Type:</span>{" "}
                                        <span className="font-medium text-slate-900">{company.pricingType}</span>
                                    </div>
                                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-50 text-emerald-600">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCompanies.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500">No customers found</p>
                        </div>
                    )}
                </>
            )}

            <AddCustomerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleCreateCustomer}
            />
        </DashboardLayout>
    );
}
