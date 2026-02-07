'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const doorProducts = [
    {
        name: 'Bifold Doors',
        description: 'Transform your living space with stunning aluminium bifold doors.',
        image: 'https://www.ultrawindows.co.uk/assets/bifold-doors-Xyy3pzwa.jpg',
        href: '/bifold-doors',
    },
    {
        name: 'Glazed Doors',
        description: 'Secure, stylish entrance doors that make a lasting impression.',
        image: 'https://www.ultrawindows.co.uk/assets/composite-door-qz6poScz.jpg',
        href: '/glazed-doors',
    },
    {
        name: 'Sliding Patio Doors',
        description: 'Sleek sliding doors with smooth operation and modern aesthetics.',
        image: 'https://www.ultrawindows.co.uk/assets/sliding-patio-doors-3Si7k_ti.jpg',
        href: '/sliding-patio-doors',
    },
    {
        name: 'French Doors',
        description: 'Elegant double doors bringing classic charm to any home.',
        image: 'https://www.ultrawindows.co.uk/assets/french-doors-CFWE6aac.jpg',
        href: '/french-doors',
    },
];

const windowProducts = [
    {
        name: 'Aluminium Windows',
        description: 'Slim, strong frames with exceptional thermal performance.',
        image: 'https://www.ultrawindows.co.uk/assets/aluminium-windows-CR3vwg-f.jpg',
        href: '/aluminium-windows',
    },
    {
        name: 'Flat Roof Lights',
        description: 'Flood your room with natural light from above.',
        image: 'https://www.ultrawindows.co.uk/assets/flat-roof-light-BfPgJzxt.jpg',
        href: '/roof-lights',
    },
    {
        name: 'Gable Windows',
        description: 'Bespoke aluminium windows in triangle and trapezoid shapes.',
        image: 'https://www.ultrawindows.co.uk/assets/gable-window-1-BIboZIEg.jpg',
        href: '/gable-windows',
    },
];

interface ProductCardProps {
    name: string;
    description: string;
    image: string;
    href: string;
    index: number;
}

function ProductCard({ name, description, image, href, index }: ProductCardProps) {
    return (
        <Reveal delay={index * 100} width="100%" animation={index % 2 === 0 ? 'fade-up' : 'scale-up'}>
            <Link href={href} className="group block relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent group-hover:from-slate-900/100 group-hover:via-slate-900/60 transition-all duration-500" />

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors duration-300">
                        {name}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{description}</p>
                    <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        </Reveal>
    );
}

export default function Products() {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Doors Section */}
                <div className="mb-12 sm:mb-16 md:mb-20">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <Reveal width="100%" animation="fade-up">
                            <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-2 text-orange-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">
                                    <div className="w-6 sm:w-8 h-px bg-orange-500/50" />
                                    Our Products
                                    <div className="w-6 sm:w-8 h-px bg-orange-500/50" />
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
                                    Welcome to Ultra Windows & Bifolds
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">
                                    Premium aluminium and glazed doors, designed and manufactured in the UK
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {doorProducts.map((product, index) => (
                            <ProductCard key={product.name} {...product} index={index} />
                        ))}
                    </div>
                </div>

                {/* Windows & Roof Section */}
                <div>
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <Reveal width="100%" animation="fade-up">
                            <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-2 text-orange-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">
                                    <div className="w-6 sm:w-8 h-px bg-orange-500/50" />
                                    Premium Range
                                    <div className="w-6 sm:w-8 h-px bg-orange-500/50" />
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
                                    Windows & Roof Products
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">
                                    High-performance aluminium windows and roof solutions for modern homes
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {windowProducts.map((product, index) => (
                            <ProductCard key={product.name} {...product} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
