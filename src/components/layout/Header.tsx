'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Phone,
    Mail,
    ChevronDown,
    Menu,
    X,
    ArrowRight,
    LogIn,
    Facebook,
    Instagram,
    Linkedin
} from 'lucide-react';

const navigation = {
    doors: [
        { name: 'Bifold Doors', href: '/bifold-doors' },
        { name: 'Sliding Patio Doors', href: '/sliding-patio-doors' },
        { name: 'Glazed Doors', href: '/glazed-doors' },
        { name: 'French Doors', href: '/french-doors' },
    ],
    windows: [
        { name: 'Aluminium Windows', href: '/aluminium-windows' },
        { name: 'Gable Windows', href: '/gable-windows' },
    ],
    more: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Delivery', href: '/delivery' },
    ],
};

const WhatsAppIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

interface DropdownProps {
    title: string;
    items: { name: string; href: string }[];
    isOpen: boolean;
    onToggle: () => void;
}

function NavDropdown({ title, items, isOpen, onToggle }: DropdownProps) {
    return (
        <div className="relative group">
            <button
                onClick={onToggle}
                onMouseEnter={onToggle}
                className="flex items-center gap-1 py-2 text-slate-700 font-medium hover:text-orange-500 transition-colors group-hover:text-orange-500"
            >
                {title}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/20 py-3 z-50 transform transition-all duration-200 origin-top-left ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                onMouseLeave={onToggle}
            >
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="block px-6 py-3 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Also reset scroll position of the drawer content if needed, but not critical
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-white/20' : 'bg-white shadow-sm'}`}>
                {/* Top Bar - Made more compact on mobile */}
                <div className={`bg-slate-900 text-white text-[10px] sm:text-xs md:text-sm py-1.5 md:py-2 transition-all duration-300 ${scrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-6">
                            <a href="tel:01707932189" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                                <Phone className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                <span className="hidden sm:inline">01707 932 189</span>
                                <span className="sm:hidden">Call Us</span>
                            </a>
                            <a href="https://wa.me/447350452948" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                                <WhatsAppIcon />
                                <span className="hidden md:inline">+44 7350 452 948</span>
                            </a>
                            <a href="mailto:sales@ultrawindows.co.uk" className="hidden lg:flex items-center gap-2 hover:text-orange-400 transition-colors">
                                <Mail className="h-3.5 w-3.5" />
                                <span>sales@ultrawindows.co.uk</span>
                            </a>
                        </div>
                        <div className="text-slate-400 font-medium hidden sm:block">
                            UK Manufacturer | Free Delivery
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 relative z-50">
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={160}
                                height={64}
                                className="h-8 md:h-12 w-auto object-contain transition-all duration-300"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            <Link href="/" className="py-2 text-slate-700 font-medium hover:text-orange-500 transition-colors">
                                Home
                            </Link>
                            <NavDropdown
                                title="Doors"
                                items={navigation.doors}
                                isOpen={openDropdown === 'doors'}
                                onToggle={() => toggleDropdown('doors')}
                            />
                            <NavDropdown
                                title="Windows"
                                items={navigation.windows}
                                isOpen={openDropdown === 'windows'}
                                onToggle={() => toggleDropdown('windows')}
                            />
                            <Link href="/roof-lights" className="py-2 text-slate-700 font-medium hover:text-orange-500 transition-colors">
                                Rooflights
                            </Link>
                            <NavDropdown
                                title="More"
                                items={navigation.more}
                                isOpen={openDropdown === 'more'}
                                onToggle={() => toggleDropdown('more')}
                            />
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <a
                                href="https://ultra-hazel.vercel.app/login"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors"
                            >
                                Trade Login
                            </a>
                            <Link href="/design-quote">
                                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 hover:shadow-orange-500/40">
                                    Get a Quote
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button - Optimized Z-index */}
                        <button
                            className="lg:hidden p-2 -mr-2 text-slate-700 relative z-50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className={`w-6 h-5 relative flex flex-col justify-between transition-all duration-300 ${mobileMenuOpen ? 'rotate-180' : ''}`}>
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Side Panel */}
            <div className={`fixed inset-x-0 bottom-0 top-[64px] z-40 lg:hidden pointer-events-none`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer Panel */}
                <div
                    className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto flex flex-col border-l border-slate-100 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {/* Header inside drawer - Removed as the main header is visible */}
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto py-6 px-6">
                        <nav className="space-y-6">
                            <Link href="/" className="block text-xl font-heading font-bold text-slate-900" onClick={() => setMobileMenuOpen(false)}>
                                Home
                            </Link>

                            <div className="space-y-3">
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Products</p>
                                {navigation.doors.map((item) => (
                                    <Link key={item.name} href={item.href} className="block text-lg text-slate-600 font-medium hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                                        {item.name}
                                    </Link>
                                ))}
                                {navigation.windows.map((item) => (
                                    <Link key={item.name} href={item.href} className="block text-lg text-slate-600 font-medium hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                                        {item.name}
                                    </Link>
                                ))}
                                <Link href="/roof-lights" className="block text-lg text-slate-600 font-medium hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                                    Rooflights
                                </Link>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Company</p>
                                {navigation.more.map((item) => (
                                    <Link key={item.name} href={item.href} className="block text-lg text-slate-600 font-medium hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </div>

                    {/* Footer inside drawer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                        <Link href="/design-quote" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
                                Get a Free Quote
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </Link>

                        <div className="flex justify-center gap-6 pt-2">
                            <a href="#" className="p-2 bg-white rounded-full text-slate-400 hover:text-orange-500 shadow-sm border border-slate-100">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full text-slate-400 hover:text-orange-500 shadow-sm border border-slate-100">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full text-slate-400 hover:text-orange-500 shadow-sm border border-slate-100">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
