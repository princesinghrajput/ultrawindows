"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, Shield, ShieldCheck, User as UserIcon } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";

interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "manager" | "user";
    lastActive: string;
    status: "active" | "inactive" | "pending";
}

// Mock users data
const mockUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@company.com",
        role: "admin",
        lastActive: "Just now",
        status: "active",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@company.com",
        role: "manager",
        lastActive: "2 hours ago",
        status: "active",
    },
    {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "user",
        lastActive: "Yesterday",
        status: "active",
    },
    {
        id: "4",
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
        role: "user",
        lastActive: "3 days ago",
        status: "inactive",
    },
    {
        id: "5",
        name: "New User",
        email: "pending@company.com",
        role: "user",
        lastActive: "Never",
        status: "pending",
    },
];

const roleIcons = {
    admin: ShieldCheck,
    manager: Shield,
    user: UserIcon,
};

const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    user: "bg-slate-100 text-slate-600",
};

const statusColors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-slate-100 text-slate-600",
    pending: "bg-amber-100 text-amber-700",
};

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = mockUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout title="User Management">
            {/* Top Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all">
                    <Plus className="w-5 h-5" />
                    Invite User
                </button>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Last Active
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => {
                            const RoleIcon = roleIcons[user.role];
                            return (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{user.name}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role]}`}>
                                            <RoleIcon className="w-3.5 h-3.5" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[user.status]}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
