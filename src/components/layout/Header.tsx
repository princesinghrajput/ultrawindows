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
    Linkedin,
    Plus,
    Minus
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
                onMouseEnter={() => !isOpen && onToggle()}
                className="flex items-center gap-1 py-2 text-slate-700 font-medium hover:text-orange-500 transition-colors group-hover:text-orange-500"
            >
                {title}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 transform transition-all duration-200 origin-top-left ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                onMouseLeave={() => isOpen && onToggle()}
            >
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="block px-6 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// Mobile specific accordion component
function MobileNavItem({ title, items, isOpen, onToggle }: DropdownProps) {
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full py-4 text-left text-lg font-medium text-slate-800"
            >
                {title}
                {isOpen ? (
                    <Minus className="h-5 w-5 text-orange-500" />
                ) : (
                    <Plus className="h-5 w-5 text-slate-400" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="flex flex-col space-y-3 pl-4 border-l-2 border-slate-100 ml-1">
                    {items.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-base text-slate-600 hover:text-orange-500 py-1 block"
                            onClick={(e) => {
                                // Close menu logic handled in parent
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileDropdowns, setMobileDropdowns] = useState<{ [key: string]: boolean }>({
        products: true, // Default open for better discovery
        company: false
    });
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
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const toggleMobileDropdown = (name: string) => {
        setMobileDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white border-b border-transparent'}`}>
                {/* Top Bar */}
                <div className={`bg-slate-900 text-white text-[10px] sm:text-xs font-medium transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-8 sm:h-9 opacity-100'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <a href="tel:01707932189" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                                <Phone className="h-3 w-3" />
                                <span className="hidden sm:inline">01707 932 189</span>
                                <span className="sm:hidden">Call Us</span>
                            </a>
                            <a href="https://wa.me/447350452948" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                                <WhatsAppIcon />
                                <span className="hidden md:inline">+44 7350 452 948</span>
                            </a>
                            <a href="mailto:sales@ultrawindows.co.uk" className="hidden lg:flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                                <Mail className="h-3.5 w-3.5" />
                                <span>sales@ultrawindows.co.uk</span>
                            </a>
                        </div>
                        <div className="text-slate-400 hidden sm:block">
                            Premium Aluminium Systems | Nationwide Delivery
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 relative z-50" onClick={() => setMobileMenuOpen(false)}>
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={180}
                                height={60}
                                className="h-8 md:h-10 w-auto object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
                                title="Company"
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
                                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5">
                                    Get Quote
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 -mr-2 text-slate-800 relative z-50 focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={`absolute top-0 right-0 h-[100dvh] w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white shrink-0">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={140}
                                height={48}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 -mr-2 text-slate-500 hover:text-orange-500 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto py-6 px-6">
                        <nav className="flex flex-col space-y-1">
                            <Link
                                href="/"
                                className="text-lg font-medium text-slate-800 py-3 border-b border-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>

                            <MobileNavItem
                                title="Our Products"
                                items={[...navigation.doors, ...navigation.windows, { name: 'Rooflights', href: '/roof-lights' }]}
                                isOpen={mobileDropdowns.products}
                                onToggle={() => toggleMobileDropdown('products')}
                                {...({} as any)}
                            />

                            <MobileNavItem
                                title="Company"
                                items={navigation.more}
                                isOpen={mobileDropdowns.company}
                                onToggle={() => toggleMobileDropdown('company')}
                                {...({} as any)}
                            />

                            <div className="pt-8 space-y-4">
                                <Link
                                    href="/design-quote"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full"
                                >
                                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
                                        Get a Free Quote
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </Link>
                                <a
                                    href="https://ultra-hazel.vercel.app/login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <LogIn className="h-5 w-5" />
                                    Trade Login
                                </a>
                            </div>
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                        <div className="flex justify-center gap-8 text-slate-400">
                            <a href="#" className="hover:text-orange-500 transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
