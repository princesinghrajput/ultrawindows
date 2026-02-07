'use client';

import Link from 'next/link';
import { ArrowRight, LogIn, Phone, Sparkles } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

export default function CTA() {
    return (
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-slate-900">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-slate-900/90 z-10" />
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"
                />
            </div>

            {/* Animated Gradient Decorations */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-0 left-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-orange-500/20 rounded-full blur-[80px] sm:blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-50 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-blue-500/20 rounded-full blur-[80px] sm:blur-[100px] translate-x-1/2 translate-y-1/2 opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <Reveal animation="zoom-in" width="100%">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                            <span className="text-xs sm:text-sm font-medium text-white/90">Transform Your Space Today</span>
                        </div>
                    </Reveal>

                    {/* Headline */}
                    <Reveal delay={100} animation="fade-up" width="100%">
                        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                            Ready to Transform <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-amber-400">
                                Your Home?
                            </span>
                        </h2>
                    </Reveal>

                    {/* Description */}
                    <Reveal delay={200} animation="fade-up" width="100%">
                        <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto font-light px-4 sm:px-0">
                            Get a free, no-obligation quote or speak to our experts about finding the perfect solution for your property.
                        </p>
                    </Reveal>

                    {/* CTA Buttons */}
                    <Reveal delay={300} animation="fade-up" width="100%">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center px-2 sm:px-0">
                            <Link href="/design-quote" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 text-sm sm:text-base group">
                                    Design & Quote
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <a
                                href="https://ultra-hazel.vercel.app/login"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 text-sm sm:text-base">
                                    <LogIn className="h-4 w-4" />
                                    Trade Login
                                </button>
                            </a>
                            <a href="tel:01707932189" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-slate-600 text-sm sm:text-base backdrop-blur-sm">
                                    <Phone className="h-4 w-4" />
                                    01707 932 189
                                </button>
                            </a>
                        </div>
                    </Reveal>

                    {/* Trust Indicators */}
                    <Reveal delay={400} animation="fade-up" width="100%">
                        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/10">
                            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-white/60 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>Free UK Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>10 Year Guarantee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>UK Manufactured</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
