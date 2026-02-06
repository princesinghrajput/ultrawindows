import Image from 'next/image';
import { CircleCheckBig } from 'lucide-react';

const highlights = [
    'Premium quality aluminium and glazed materials',
    'Custom-made to your exact specifications',
    'Advanced security features as standard',
    'Industry-leading thermal performance',
    'Nationwide delivery service',
    'Expert installation guidance available',
];

export default function About() {
    return (
        <section id="about" className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://www.ultrawindows.co.uk/assets/bifold-doors-Xyy3pzwa.jpg"
                                alt="Premium Aluminium Doors Installation"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Decorative gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 to-transparent" />
                        </div>
                        {/* Experience Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl hidden md:block transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-heading font-bold">10+</div>
                            <div className="text-sm font-medium opacity-90">Years Experience</div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-2xl -z-10 hidden lg:block" />
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-100 rounded-2xl -z-10 hidden lg:block" />
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
                            What We Do
                        </span>
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            Crafting Premium{' '}
                            <span className="text-orange-500">Aluminium Products</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-5 leading-relaxed">
                            We are a UK based manufacturer of high-quality aluminium bifold doors,
                            french doors, sliding patio doors, glazed doors and flat roof lights.
                            Our products are top of the range, offering unmatched security features
                            and sleek finishing touches.
                        </p>

                        <p className="text-slate-600 mb-5 leading-relaxed">
                            Every product we manufacture is designed with precision engineering and
                            crafted using premium materials. We take pride in delivering exceptional
                            quality that transforms homes across the UK.
                        </p>

                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Our mission is to enhance homes with sustainable, stylish, and secure
                            aluminium glazing solutions, specialising in premium bifold doors and
                            windows.
                        </p>

                        <ul className="space-y-4">
                            {highlights.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 group"
                                >
                                    <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-200">
                                        <CircleCheckBig className="h-4 w-4 text-orange-500 group-hover:text-white transition-colors duration-200" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
