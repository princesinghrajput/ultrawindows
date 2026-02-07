'use client';

import {
    Shield,
    Ruler,
    Palette,
    Zap,
    Award,
    HeartHandshake,
    LucideIcon
} from 'lucide-react';
import { Reveal } from '../ui/Reveal';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    iconGradient: string;
}

const features: Feature[] = [
    {
        icon: Shield,
        title: '10 Year Guarantee',
        description: 'All our products come with a comprehensive 10-year manufacturer\'s guarantee for your peace of mind.',
        gradient: 'from-orange-500/10 to-amber-500/5',
        iconGradient: 'from-orange-500 to-amber-500'
    },
    {
        icon: Ruler,
        title: 'Made to Measure',
        description: 'Every door and window is custom-built to your exact specifications for a perfect fit.',
        gradient: 'from-blue-500/10 to-cyan-500/5',
        iconGradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Palette,
        title: 'RAL Colour Options',
        description: 'Choose from a wide range of RAL colours to match your home\'s aesthetic perfectly.',
        gradient: 'from-purple-500/10 to-pink-500/5',
        iconGradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: Zap,
        title: 'Energy Efficient',
        description: 'Our products feature advanced thermal breaks and double glazing for maximum efficiency.',
        gradient: 'from-emerald-500/10 to-teal-500/5',
        iconGradient: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Award,
        title: 'UK Manufactured',
        description: 'Proudly designed and manufactured in the UK to the highest quality standards.',
        gradient: 'from-rose-500/10 to-red-500/5',
        iconGradient: 'from-rose-500 to-red-500'
    },
    {
        icon: HeartHandshake,
        title: 'Expert Support',
        description: 'Our dedicated team provides expert advice and support throughout your project.',
        gradient: 'from-indigo-500/10 to-violet-500/5',
        iconGradient: 'from-indigo-500 to-violet-500'
    },
];

interface FeatureCardProps {
    feature: Feature;
    index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
    const Icon = feature.icon;

    return (
        <Reveal
            delay={index * 100}
            width="100%"
            animation={index % 2 === 0 ? 'fade-up' : 'scale-up'}
        >
            <div className="group relative h-full">
                {/* Background glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                {/* Card */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 h-full flex flex-col overflow-hidden">
                    {/* Subtle gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                        {/* Icon */}
                        <div className="relative mx-auto mb-5 sm:mb-6">
                            {/* Icon glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 scale-150`} />

                            {/* Icon container */}
                            <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500`}>
                                <div className={`absolute inset-0.5 sm:inset-1 rounded-[10px] sm:rounded-xl bg-white flex items-center justify-center group-hover:bg-transparent transition-colors duration-500`}>
                                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 text-slate-700 group-hover:text-white transition-colors duration-500`} strokeWidth={1.5} />
                                </div>
                                {/* Gradient overlay for hover state */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center`}>
                                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-slate-900 transition-colors duration-300">
                            {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-grow group-hover:text-slate-700 transition-colors duration-300">
                            {feature.description}
                        </p>

                        {/* Hover indicator */}
                        <div className="mt-4 sm:mt-6 flex justify-center">
                            <div className="h-1 w-0 group-hover:w-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

export default function Features() {
    return (
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/80 to-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
                    <Reveal width="100%" animation="fade-up">
                        <div className="flex flex-col items-center">
                            <span className="inline-flex items-center gap-2 text-orange-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">
                                <div className="w-6 sm:w-8 h-px bg-orange-500/50" />
                                Why Choose Ultra Windows
                                <div className="w-6 sm:w-8 h-px bg-orange-500/50" />
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">
                                Excellence in Every Detail
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                                We&apos;re committed to delivering exceptional quality and service on every project,
                                from manufacturing to installation.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
