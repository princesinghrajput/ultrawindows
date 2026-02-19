"use client";

import { MessageCircle, Phone, Mail, FileText, ExternalLink, Search } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";

const helpSections = [
    {
        title: "Getting Started",
        icon: FileText,
        color: "bg-blue-100 text-blue-600",
        articles: [
            { title: "How to create your first quote", href: "#" },
            { title: "Understanding the dashboard", href: "#" },
            { title: "Managing your customers", href: "#" },
            { title: "Setting up your account", href: "#" },
        ],
    },
    {
        title: "Quotes & Orders",
        icon: FileText,
        color: "bg-green-100 text-green-600",
        articles: [
            { title: "Creating a new quote", href: "#" },
            { title: "Converting quotes to orders", href: "#" },
            { title: "Tracking order status", href: "#" },
            { title: "Printing and exporting", href: "#" },
        ],
    },
    {
        title: "Products & Pricing",
        icon: FileText,
        color: "bg-purple-100 text-purple-600",
        articles: [
            { title: "Understanding product configurations", href: "#" },
            { title: "Pricing and discounts", href: "#" },
            { title: "Custom product options", href: "#" },
            { title: "Product specifications", href: "#" },
        ],
    },
];

export default function HelpPage() {
    return (
        <DashboardLayout title="Help & Support">
            {/* Search */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for help articles..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-lg shadow-slate-200/50"
                    />
                </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <a
                    href="tel:+441onal234567890"
                    className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Call Us</h3>
                        <p className="text-sm text-slate-500">Mon-Fri 9am - 5pm</p>
                    </div>
                </a>

                <a
                    href="mailto:support@ultrawindows.co.uk"
                    className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Email Support</h3>
                        <p className="text-sm text-slate-500">We reply within 24 hours</p>
                    </div>
                </a>

                <button className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all group text-left">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Live Chat</h3>
                        <p className="text-sm text-slate-500">Chat with our team</p>
                    </div>
                </button>
            </div>

            {/* Help Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {helpSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={section.title}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-slate-900">
                                        {section.title}
                                    </h3>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {section.articles.map((article) => (
                                    <a
                                        key={article.title}
                                        href={article.href}
                                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                                    >
                                        <span className="text-sm text-slate-700 group-hover:text-slate-900">
                                            {article.title}
                                        </span>
                                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
}
