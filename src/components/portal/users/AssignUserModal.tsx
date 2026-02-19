"use client";

import { useState, useEffect } from "react";
import { X, Search, ShieldCheck } from "lucide-react";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setUserType("customer");
    setSelectedCompany(null);
    setSearchQuery("");

    fetch("/api/companies")
      .then((res) => res.json())
      .then(setCompanies)
      .catch(console.error);
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = async () => {
    if (userType === "customer" && !selectedCompany) return;

    setLoading(true);
    try {
      await onAssign(
        userId,
        userType === "staff" ? "staff" : "user",
        selectedCompany?._id
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Approve Access
            </h3>
            <p className="text-sm text-slate-500">
              {userName}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5">

          {/* Role Toggle */}
          <div className="flex rounded-md border overflow-hidden text-sm">
            <button
              onClick={() => setUserType("customer")}
              className={`flex-1 py-2 ${userType === "customer"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600"
                }`}
            >
              Customer
            </button>
            <button
              onClick={() => setUserType("staff")}
              className={`flex-1 py-2 ${userType === "staff"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600"
                }`}
            >
              Staff
            </button>
          </div>

          {/* Company Selector */}
          {userType === "customer" && (
            <div className="relative">
              {selectedCompany ? (
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-slate-50 text-sm">
                  <span>{selectedCompany.name}</span>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setDropdownOpen(true)}
                      className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  {dropdownOpen && searchQuery && (
                    <div className="mt-1 border rounded-md max-h-48 overflow-y-auto bg-white text-sm">
                      {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-slate-500">
                          No results
                        </div>
                      ) : (
                        filtered.map((c) => (
                          <button
                            key={c._id}
                            onMouseDown={() => {
                              setSelectedCompany(c);
                              setSearchQuery("");
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-100"
                          >
                            {c.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Staff Info */}
          {userType === "staff" && (
            <div className="flex items-start gap-3 text-sm text-slate-600 border rounded-md p-3 bg-slate-50">
              <ShieldCheck size={16} className="mt-0.5" />
              <p>User will receive staff privileges.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || (userType === "customer" && !selectedCompany)}
            className="px-4 py-2 text-sm bg-slate-900 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}