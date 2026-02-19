"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Building2, MoreHorizontal, Loader2, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import AddCustomerModal from "@/components/portal/customers/AddCustomerModal";

interface Company {
    _id: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    pricingType: string;
    address?: string;
    postcode?: string;
    createdAt: string;
    customGlassPrices?: any[];
    priceOverrides?: any[];
}

export default function CustomersPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Company | undefined>(undefined);

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

    const handleSaveCustomer = async (data: any) => {
        try {
            if (selectedCustomer) {
                // Update
                const res = await fetch(`/api/companies/${selectedCustomer._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (res.ok) {
                    fetchCompanies();
                    setIsModalOpen(false);
                    setSelectedCustomer(undefined);
                } else {
                    console.error("Failed to update customer");
                }
            } else {
                // Create
                const res = await fetch("/api/companies", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (res.ok) {
                    fetchCompanies();
                    setIsModalOpen(false);
                } else {
                    console.error("Failed to create customer");
                }
            }
        } catch (error) {
            console.error("Error saving customer", error);
        }
    };

    const handleDeleteCustomer = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/companies/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchCompanies();
            } else {
                console.error("Failed to delete customer");
            }
        } catch (error) {
            console.error("Error deleting customer", error);
        }
    };

    const handleEditCustomer = (customer: Company, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(undefined);
        setIsModalOpen(true);
    };

    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (company.contactName && company.contactName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const hasOwnPricing = (company: Company) => {
        // Simple logic: if they have specific overrides or glass prices, or non-Trade?
        // Let's assume having overrides means "Yes"
        const hasOverrides = (company.priceOverrides && company.priceOverrides.length > 0) ||
            (company.customGlassPrices && company.customGlassPrices.length > 0);
        return hasOverrides ? "Yes" : "No";
    };

    return (
        <DashboardLayout
            title="View Customers"
            actions={
                <button
                    onClick={handleAddCustomer}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Customer
                </button>
            }
        >
            {/* Filters */}
            <div className="flex justify-end mb-4">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-600">Company</th>
                                    <th className="px-6 py-3 font-medium text-slate-600">Address</th>
                                    <th className="px-6 py-3 font-medium text-slate-600">Postcode</th>
                                    <th className="px-6 py-3 font-medium text-slate-600">Phone</th>
                                    <th className="px-6 py-3 font-medium text-slate-600">Email</th>
                                    <th className="px-6 py-3 font-medium text-slate-600">Has own pricing?</th>
                                    <th className="px-6 py-3 font-medium text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCompanies.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            No customers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCompanies.map((company) => (
                                        <tr
                                            key={company._id}
                                            onClick={() => handleEditCustomer(company)}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {company.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {company.address || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {company.postcode || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {company.phone || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {company.email || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {hasOwnPricing(company)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => handleEditCustomer(company, e)}
                                                        className="p-1.5 text-slate-400 hover:text-orange-500 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteCustomer(company._id, e)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddCustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCustomer}
                customer={selectedCustomer}
            />
        </DashboardLayout>
    );
}
