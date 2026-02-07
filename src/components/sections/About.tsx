'use client';

import Image from 'next/image';
import { CircleCheckBig, Shield, Star, Users } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const stats = [
    { label: 'Years Experience', value: '10+', icon: Star },
    { label: 'Projects Completed', value: '500+', icon: CircleCheckBig },
    { label: 'Happy Clients', value: '100%', icon: Users },
];

const highlights = [
    {
        title: 'Premium Materials',
        description: 'High-grade aluminium and efficient glazing for lasting performance.'
    },
    {
        title: 'Bespoke Design',
        description: 'Custom-made to your exact specifications and style preferences.'
    },
    {
        title: 'Advanced Security',
        description: 'Multi-point locking systems for complete peace of mind.'
    },
    {
        title: 'Thermal Efficiency',
        description: 'Industry-leading ratings to keep your home warm and energy bills low.'
    }
];

export default function About() {
    return (
        <section id="about" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/2 sm:w-1/3 h-1/3 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 sm:w-1/4 h-1/4 bg-slate-200/50 rounded-tr-[80px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/3 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 xl:gap-24 items-center">
                    {/* Image Section */}
                    <div className="relative order-2 lg:order-1">
                        <Reveal width="100%" animation="fade-right">
                            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 group">
                                <Image
                                    src="https://www.ultrawindows.co.uk/assets/bifold-doors-Xyy3pzwa.jpg"
                                    alt="Premium Aluminium Doors Installation"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60" />
                            </div>
                        </Reveal>

                        {/* Floating Experience Card - Desktop only */}
                        <Reveal delay={300} animation="zoom-in" className="absolute -bottom-6 sm:-bottom-10 -right-0 sm:-right-10 z-20 hidden md:block">
                            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl ring-1 ring-slate-100 max-w-xs transform transition-all hover:-translate-y-1 hover:shadow-2xl duration-300">
                                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center text-orange-600 shadow-inner">
                                        <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Guarantee</p>
                                        <p className="text-lg sm:text-xl font-bold text-slate-900">10 Years</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Every installation is backed by our comprehensive warranty for your peace of mind.
                                </p>
                            </div>
                        </Reveal>

                        {/* Decorative Dot Pattern - Large screens */}
                        <div className="absolute -top-12 -left-12 -z-10 opacity-20 hidden lg:block">
                            <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
                                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="2" className="text-slate-900" fill="currentColor" />
                                </pattern>
                                <rect width="100" height="100" fill="url(#dots)" />
                            </svg>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="order-1 lg:order-2">
                        <Reveal width="100%" animation="fade-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 shadow-sm">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 animate-pulse" />
                                About Us
                            </div>
                        </Reveal>

                        <Reveal delay={100} width="100%" animation="fade-up">
                            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 sm:mb-6 leading-[1.15]">
                                Crafting Excellence in <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                                    Aluminium Glazing
                                </span>
                            </h2>
                        </Reveal>

                        <Reveal delay={200} width="100%" animation="fade-up">
                            <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-lg font-medium">
                                We are a premier UK manufacturer dedicated to transforming homes with high-performance aluminium bifold doors, sliding systems, and roof lights. Innovative design meets precision engineering.
                            </p>
                        </Reveal>

                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-6 md:gap-x-8 md:gap-y-8 mb-8 sm:mb-10">
                            {highlights.map((item, index) => (
                                <Reveal key={index} delay={300 + index * 80} width="100%" animation="fade-left">
                                    <div className="group p-3 sm:p-0 rounded-xl sm:rounded-none bg-white/50 sm:bg-transparent hover:bg-orange-50/50 sm:hover:bg-transparent transition-colors duration-300">
                                        <h3 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors">
                                            <CircleCheckBig className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6 sm:pl-7 border-l-2 border-slate-200 group-hover:border-orange-300 transition-colors">
                                            {item.description}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <Reveal delay={600} width="100%" animation="fade-up">
                            <div className="flex flex-wrap gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-200">
                                {stats.map((stat, index) => (
                                    <div key={index} className="relative group">
                                        <div className="absolute inset-0 bg-orange-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative">
                                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                                                {stat.value}
                                            </div>
                                            <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* Mobile Guarantee Card */}
                        <Reveal delay={700} width="100%" animation="fade-up" className="md:hidden mt-8">
                            <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-2xl shadow-lg ring-1 ring-orange-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Guarantee</p>
                                        <p className="text-xl font-bold text-slate-900">10 Year Warranty</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
