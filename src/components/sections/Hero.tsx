'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LogIn, Shield, Award, Truck } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const trustBadges = [
    { icon: Shield, text: '10 Year Guarantee' },
    { icon: Award, text: 'UK Manufactured' },
    { icon: Truck, text: 'Free UK Delivery' },
];

export default function Hero() {
    return (
        <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://www.ultrawindows.co.uk/assets/hero-bifold-doors-Ev8iHQU7.jpg"
                    alt="Premium Aluminium Bifold Doors"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                />
                {/* Enhanced Gradient Overlay - Stronger on mobile for readability */}
                <div className="absolute inset-0 hero-gradient-mobile md:hero-gradient" />
            </div>

            {/* Content - Centered */}
            <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 py-20 md:py-16 xl:py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    {/* Headline */}
                    <Reveal width="100%" animation="fade-up" duration={1000}>
                        <h1 className="font-heading text-[2rem] leading-[1.15] sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-5 md:mb-6 tracking-tight">
                            Premium Aluminium
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 mt-1 md:mt-2">
                                Doors & Windows
                            </span>
                        </h1>
                    </Reveal>

                    {/* Subheadline */}
                    <Reveal delay={200} width="100%" animation="fade-up" duration={900}>
                        <p className="text-[0.95rem] sm:text-lg text-white/90 mb-7 md:mb-8 leading-relaxed max-w-xl md:max-w-2xl mx-auto font-light px-2 sm:px-0">
                            UK manufactured high-quality aluminium bifold doors, sliding patio doors,
                            glazed doors and flat roof lights. Unmatched security and sleek design.
                        </p>
                    </Reveal>

                    {/* CTA Buttons */}
                    <Reveal delay={400} width="100%" animation="fade-up" duration={800}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mb-10 md:mb-12 justify-center px-2 sm:px-0">
                            <Link href="/design-quote" className="w-full sm:w-auto group">
                                <button className="btn-primary text-sm sm:text-base w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-xl group-hover:shadow-orange-500/50 transition-all duration-300">
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
                                <button className="btn-secondary text-sm sm:text-base w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300">
                                    <LogIn className="h-4 w-4" />
                                    Trade Login
                                </button>
                            </a>
                        </div>
                    </Reveal>

                    {/* Trust Badges - Vertical stack on mobile, horizontal on desktop */}
                    <Reveal delay={600} width="100%" animation="zoom-in" duration={700}>
                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:gap-5">
                            {trustBadges.map((badge, index) => (
                                <div
                                    key={badge.text}
                                    className="trust-badge-mobile sm:trust-badge w-full max-w-[220px] sm:w-auto sm:max-w-none hover:scale-105 transition-transform duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="trust-badge-icon w-8 h-8 sm:w-7 sm:h-7 flex-shrink-0">
                                        <badge.icon className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-orange-400" />
                                    </div>
                                    <span className="text-sm sm:text-sm font-medium text-white">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
                <Reveal delay={1000} animation="fade-up">
                    <div className="w-7 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2 hover:border-white/50 transition-colors cursor-pointer">
                        <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
