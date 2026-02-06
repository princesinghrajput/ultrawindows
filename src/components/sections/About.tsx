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
        <section id="about" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://www.ultrawindows.co.uk/assets/bifold-doors-Xyy3pzwa.jpg"
                                alt="Premium Aluminium Doors Installation"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        {/* Experience Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-xl hidden md:block">
                            <div className="text-4xl font-bold">10+</div>
                            <div className="text-sm font-medium">Years Experience</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
                            What We Do
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
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

                        <ul className="space-y-3">
                            {highlights.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <CircleCheckBig className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
