"use client";

import { useState, useEffect } from "react";
import { X, Search, CheckCircle, UserCheck, ShieldCheck, Building2 } from "lucide-react";

interface Company {
  _id: string;
  name: string;
}

interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  onAssign: (userId: string, role: string, companyId?: string) => Promise<void>;
}

export default function AssignUserModal({
  isOpen,
  onClose,
  userName,
  userId,
  onAssign,
}: AssignUserModalProps) {
  const [userType, setUserType] = useState<"staff" | "customer">("customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCompanies, setFetchingCompanies] = useState(false);

  useEffect(() => {
    if (isOpen && companies.length === 0) {
      setFetchingCompanies(true);
      fetch("/api/companies")
        .then((res) => res.json())
        .then((data) => setCompanies(data))
        .catch((err) => console.error(err))
        .finally(() => setFetchingCompanies(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = async () => {
    if (userType === "customer" && !selectedCompany) return;

    setLoading(true);
    try {
      await onAssign(
        userId,
        userType === "staff" ? "admin" : "user",
        userType === "customer" ? selectedCompany?._id : undefined
      );
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Assign User</h3>
            <p className="text-sm text-slate-500">
              Grant access to <span className="font-medium text-slate-900">{userName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">User Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType("staff")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${userType === "staff"
                    ? "bg-purple-50 border-purple-200 text-purple-700 ring-1 ring-purple-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">Staff</span>
              </button>
              <button
                onClick={() => setUserType("customer")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${userType === "customer"
                    ? "bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="font-medium">Customer</span>
              </button>
            </div>
          </div>

          {/* Customer Company Selection */}
          {userType === "customer" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-medium text-slate-700">Select Company</label>

              {selectedCompany ? (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-orange-900">{selectedCompany.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="p-1 text-orange-400 hover:text-orange-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />

                  {/* Dropdown Results */}
                  {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      {fetchingCompanies ? (
                        <div className="p-3 text-center text-sm text-slate-400">Loading...</div>
                      ) : filteredCompanies.length === 0 ? (
                        <div className="p-3 text-center text-sm text-slate-400">No companies found</div>
                      ) : (
                        filteredCompanies.map((company) => (
                          <button
                            key={company._id}
                            onClick={() => {
                              setSelectedCompany(company);
                              setSearchQuery("");
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          >
                            <span className="text-slate-700 font-medium group-hover:text-slate-900">
                              {company.name}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || (userType === "customer" && !selectedCompany)}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Assigning..." : "Assign User"}
          </button>
        </div>
      </div>
    </div>
  );
}
