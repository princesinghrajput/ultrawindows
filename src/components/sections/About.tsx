import Image from 'next/image';
import { CircleCheckBig, Shield, Star, Users } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const stats = [
    { label: 'Years Experience', value: '10+', icon: Star },
    { label: 'Project Completed', value: '500+', icon: CircleCheckBig },
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
        <section id="about" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-500/5 rounded-bl-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-slate-200/50 rounded-tr-[80px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Image Section */}
                    <div className="relative order-2 lg:order-1">
                        <Reveal width="100%">
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 group">
                                <Image
                                    src="https://www.ultrawindows.co.uk/assets/bifold-doors-Xyy3pzwa.jpg"
                                    alt="Premium Aluminium Doors Installation"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                            </div>
                        </Reveal>

                        {/* Floating Experience Card */}
                        <Reveal delay={200} className="absolute -bottom-10 -right-10 z-20 hidden md:block">
                            <div className="bg-white p-6 rounded-2xl shadow-xl ring-1 ring-slate-100 max-w-xs transform transition-transform hover:-translate-y-1 duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Guarantee</p>
                                        <p className="text-xl font-bold text-slate-900">10 Years</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Every installation is backed by our comprehensive warranty for your peace of mind.
                                </p>
                            </div>
                        </Reveal>

                        {/* Decorative Dot Pattern */}
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
                        <Reveal width="100%">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                About Us
                            </div>
                        </Reveal>

                        <Reveal delay={100} width="100%">
                            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.15]">
                                Crafting Excellence in <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                                    Aluminium Glazing
                                </span>
                            </h2>
                        </Reveal>

                        <Reveal delay={200} width="100%">
                            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-lg font-medium">
                                We are a premier UK manufacturer dedicated to transforming homes with high-performance aluminium bifold doors, sliding systems, and roof lights. Innovative design meets precision engineering.
                            </p>
                        </Reveal>

                        {/* Highlights Grid */}
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10 mb-10">
                            {highlights.map((item, index) => (
                                <Reveal key={index} delay={300 + index * 100} width="100%">
                                    <div className="group">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                            <CircleCheckBig className="w-5 h-5 text-orange-500" />
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed pl-7 border-l-2 border-slate-200 group-hover:border-orange-200 transition-colors">
                                            {item.description}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-200">
                            {stats.map((stat, index) => (
                                <Reveal key={index} delay={500 + index * 100}>
                                    <div>
                                        <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
