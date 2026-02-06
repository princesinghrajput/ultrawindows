import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LogIn, Shield, Award, Truck } from 'lucide-react';

const trustBadges = [
    { icon: Shield, text: '10 Year Guarantee' },
    { icon: Award, text: 'UK Manufactured' },
    { icon: Truck, text: 'Free UK Delivery' },
];

export default function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-2xl">
                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Premium Aluminium
                        <span className="block text-orange-500 mt-2">Doors & Windows</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
                        UK manufactured high-quality aluminium bifold doors, sliding patio doors,
                        glazed doors and flat roof lights. Unmatched security and sleek design.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Link href="/design-quote">
                            <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base w-full sm:w-auto">
                                Design & Quote
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </Link>
                        <a
                            href="https://ultra-hazel.vercel.app/login"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base w-full sm:w-auto">
                                <LogIn className="h-5 w-5" />
                                Trade Login
                            </button>
                        </a>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-6 md:gap-8">
                        {trustBadges.map((badge) => (
                            <div
                                key={badge.text}
                                className="flex items-center gap-3"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                                    <badge.icon className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-sm font-medium text-white">{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block animate-bounce">
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/60 rounded-full" />
                </div>
            </div>
        </section>
    );
}
