import Link from 'next/link';
import { ArrowRight, LogIn, Phone } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-900">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-slate-900/90 z-10" />
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"
                />
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Ready to Transform <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                            Your Home?
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                        Get a free, no-obligation quote or speak to our experts about finding the perfect solution for your property.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/design-quote" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 text-base group">
                                Design & Quote
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <a
                            href="https://ultra-hazel.vercel.app/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        >
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 text-base">
                                <LogIn className="h-4 w-4" />
                                Trade Login
                            </button>
                        </a>
                        <a href="tel:01707932189" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-slate-600 text-base">
                                <Phone className="h-4 w-4" />
                                01707 932 189
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
