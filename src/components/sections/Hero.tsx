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
        <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://www.ultrawindows.co.uk/assets/hero-bifold-doors-Ev8iHQU7.jpg"
                    alt="Premium Aluminium Bifold Doors"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 hero-gradient" />
            </div>

            {/* Content - Centered */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 xl:py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    {/* Headline */}
                    <Reveal width="100%">
                        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Premium Aluminium
                            <span className="block text-orange-500 mt-2">Doors & Windows</span>
                        </h1>
                    </Reveal>

                    {/* Subheadline */}
                    <Reveal delay={200} width="100%">
                        <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto font-light">
                            UK manufactured high-quality aluminium bifold doors, sliding patio doors,
                            glazed doors and flat roof lights. Unmatched security and sleek design.
                        </p>
                    </Reveal>

                    {/* CTA Buttons */}
                    <Reveal delay={400} width="100%">
                        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                            <Link href="/design-quote">
                                <button className="btn-primary text-sm sm:text-base w-full sm:w-auto px-8 py-3.5">
                                    Design & Quote
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                            <a
                                href="https://ultra-hazel.vercel.app/login"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="btn-secondary text-sm sm:text-base w-full sm:w-auto px-8 py-3.5">
                                    <LogIn className="h-4 w-4" />
                                    Trade Login
                                </button>
                            </a>
                        </div>
                    </Reveal>

                    {/* Trust Badges */}
                    <Reveal delay={600} width="100%">
                        <div className="flex flex-wrap gap-3 md:gap-5 justify-center">
                            {trustBadges.map((badge) => (
                                <div
                                    key={badge.text}
                                    className="trust-badge"
                                >
                                    <div className="trust-badge-icon w-7 h-7">
                                        <badge.icon className="h-3.5 w-3.5 text-orange-400" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-white">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
                <div className="w-7 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
}
