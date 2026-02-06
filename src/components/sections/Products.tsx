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
}

function ProductCard({ name, description, image, href }: ProductCardProps) {
    return (
        <Link href={href} className="group block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent group-hover:from-slate-900/95 group-hover:via-slate-900/60 transition-all duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{name}</h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">{description}</p>
                <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}

export default function Products() {
    return (
        <section className="py-16 md:py-20 lg:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Doors Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <Reveal width="100%">
                            <div className="flex flex-col items-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                    Welcome to Ultra Windows & Bifolds
                                </h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    Premium aluminium and glazed doors, designed and manufactured in the UK
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {doorProducts.map((product, index) => (
                            <Reveal key={product.name} delay={index * 100} width="100%">
                                <ProductCard {...product} />
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Windows & Roof Section */}
                <div>
                    <div className="text-center mb-12">
                        <Reveal width="100%">
                            <div className="flex flex-col items-center">
                                <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">
                                    Premium Range
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                    Windows & Roof Products
                                </h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    High-performance aluminium windows and roof solutions for modern homes
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {windowProducts.map((product, index) => (
                            <Reveal key={product.name} delay={index * 100} width="100%">
                                <ProductCard {...product} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
