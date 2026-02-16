
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        ) : (
                            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                        )}
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-500">
                            Step {step} of {totalSteps}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
};

export default ConfiguratorLayout;
