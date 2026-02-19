"use client";

import { useState, useEffect } from "react";
import { Search, UserCheck, Clock, ShieldAlert, MoreHorizontal, Loader2, CheckCircle, XCircle, Shield, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import AssignUserModal from "@/components/portal/users/AssignUserModal";

interface User {
    _id: string;
    name: string;
    email: string;
    company: string; // The requested company string or assigned company name
    role: string;
    status: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAssign = async (userId: string, role: string, companyId?: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/approve`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, companyId }),
            });

            if (res.ok) {
                fetchUsers(); // Refresh list to update the user status
                setSelectedUser(null);
            } else {
                console.error("Failed to approve user");
            }
        } catch (error) {
            console.error("Error approving user", error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchUsers();
            } else {
                console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingCount = users.filter(u => u.status === 'pending').length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        <CheckCircle className="w-3 h-3" />
                        Active
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <XCircle className="w-3 h-3" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <DashboardLayout title="User Management">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                        <ShieldAlert className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{pendingCount}</span> Pending Requests
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{users.length}</span> Total Users
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No users found.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-600">User</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Company</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Role</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Status</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Date</th>
                                <th className="px-6 py-3 font-medium text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-700">{user.company}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-700 capitalize">
                                            {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-500" />}
                                            {user.role === 'staff' && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.status === 'pending' && (
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                                                >
                                                    Review
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                                                title="Delete User"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AssignUserModal
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                userName={selectedUser?.name || ""}
                userId={selectedUser?._id || ""}
                onAssign={handleAssign}
            />
        </DashboardLayout>
    );
}
