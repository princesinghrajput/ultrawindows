
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ConfiguratorLayoutProps {
    children: React.ReactNode;
    title: string;
    step: number;
    totalSteps: number;
    onBack?: () => void;
}

const ConfiguratorLayout: React.FC<ConfiguratorLayoutProps> = ({
    children,
    title,
    step,
    totalSteps,
    onBack,
}) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header — sticks to very top, no offset */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                        ) : (
                            <Link href="/portal/quotes" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </Link>
                        )}
                        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">
                            Step {step} of {totalSteps}
                        </span>
                        {/* Progress Bar */}
                        <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all duration-300 rounded-full"
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full">
                {children}
            </main>
        </div>
    );
};

export default ConfiguratorLayout;
