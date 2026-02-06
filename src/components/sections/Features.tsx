import {
    Shield,
    Ruler,
    Palette,
    Zap,
    Award,
    HeartHandshake
} from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: '10 Year Guarantee',
        description: 'All our products come with a comprehensive 10-year manufacturer\'s guarantee for your peace of mind.',
    },
    {
        icon: Ruler,
        title: 'Made to Measure',
        description: 'Every door and window is custom-built to your exact specifications for a perfect fit.',
    },
    {
        icon: Palette,
        title: 'RAL Colour Options',
        description: 'Choose from a wide range of RAL colours to match your home\'s aesthetic perfectly.',
    },
    {
        icon: Zap,
        title: 'Energy Efficient',
        description: 'Our products feature advanced thermal breaks and double glazing for maximum efficiency.',
    },
    {
        icon: Award,
        title: 'UK Manufactured',
        description: 'Proudly designed and manufactured in the UK to the highest quality standards.',
    },
    {
        icon: HeartHandshake,
        title: 'Expert Support',
        description: 'Our dedicated team provides expert advice and support throughout your project.',
    },
];

export default function Features() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
                        Why Choose Ultra Windows
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-6">
                        Excellence in Every Detail
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We&apos;re committed to delivering exceptional quality and service on every project,
                        from manufacturing to installation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white rounded-2xl p-8 text-center border border-slate-100 hover:border-orange-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-orange-500/25 group-hover:scale-110">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
