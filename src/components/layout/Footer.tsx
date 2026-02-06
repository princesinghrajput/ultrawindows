import Link from 'next/link';
import Image from 'next/image';
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Linkedin
} from 'lucide-react';

const WhatsAppIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const footerLinks = {
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
    roof: [
        { name: 'Flat Roof Lights', href: '/roof-lights' },
    ],
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Delivery Information', href: '/delivery' },
        { name: 'FAQs', href: '/faqs' },
    ],
};

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/ultrawindowsandbifolds',
        icon: Facebook
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/ultrawindowsandbifolds',
        icon: Instagram
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/ultra-windows-bifolds-ltd',
        icon: Linkedin
    },
];

export default function Footer() {
    return (
        <footer id="contact" className="bg-slate-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
                    {/* Company Info - Takes 2 columns on large screens */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Image
                            src="https://www.ultrawindows.co.uk/lovable-uploads/2a5b2ca2-19cf-408a-b7a2-9d9e3b9e31c0.png"
                            alt="Ultra Windows"
                            width={140}
                            height={56}
                            className="h-12 w-auto mb-5 object-contain"
                        />
                        <p className="text-slate-400 mb-6 max-w-sm leading-relaxed text-sm">
                            UK manufacturer of premium aluminium doors, windows, and roof products.
                            Quality craftsmanship with a 10-year guarantee.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a
                                href="tel:01707932189"
                                className="flex items-center gap-3 text-slate-400 hover:text-orange-400 transition-colors group"
                            >
                                <Phone className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">01707932189</span>
                            </a>
                            <a
                                href="https://wa.me/447350452948"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-slate-400 hover:text-orange-400 transition-colors group"
                            >
                                <span className="text-orange-400 group-hover:scale-110 transition-transform"><WhatsAppIcon /></span>
                                <span className="text-sm">+447350452948</span>
                            </a>
                            <a
                                href="mailto:sales@ultrawindows.co.uk"
                                className="flex items-center gap-3 text-slate-400 hover:text-orange-400 transition-colors group"
                            >
                                <Mail className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">sales@ultrawindows.co.uk</span>
                            </a>
                            <a
                                href="https://maps.app.goo.gl/LwdPWABqGCmDXxmy8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 text-slate-400 hover:text-orange-400 transition-colors group"
                            >
                                <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-sm leading-relaxed">
                                    Ultra Windows & Bifolds<br />
                                    Capital Connect, Bay 3, Travellers Lane,<br />
                                    Welham Green, Hatfield, AL9 7HF
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Doors Column */}
                    <div>
                        <h3 className="font-heading text-base font-bold text-white mb-4">Doors</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.doors.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Windows & Roof Column */}
                    <div>
                        <h3 className="font-heading text-base font-bold text-white mb-4">Windows</h3>
                        <ul className="space-y-2.5 mb-6">
                            {footerLinks.windows.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-heading text-base font-bold text-white mb-4">Roof Products</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.roof.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="font-heading text-base font-bold text-white mb-4">Company</h3>
                        <ul className="space-y-2.5 mb-6">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Follow us on ${social.name}`}
                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-500 transition-all duration-200 hover:scale-110"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Copyright & Legal */}
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2026 Ultra Windows & Bifolds Ltd. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-conditions" className="hover:text-orange-400 transition-colors">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Group Companies */}
                <div className="border-t border-slate-800 mt-6 pt-6 text-center">
                    <p className="text-sm text-slate-500 mb-4">
                        Part of <span className="text-orange-400">Ultra Group</span> of Companies
                    </p>
                    <div className="flex justify-center items-center gap-4 flex-wrap">
                        <a
                            href="https://www.ultratough.co.uk/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 bg-slate-800 rounded-lg hover:bg-orange-500 transition-all duration-200 text-white font-medium text-sm hover:scale-105"
                        >
                            Ultra Tough
                        </a>
                        <a
                            href="https://www.advancedsealedunits.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 bg-slate-800 rounded-lg hover:bg-orange-500 transition-all duration-200 text-white font-medium text-sm hover:scale-105"
                        >
                            Advanced Sealed Units
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
