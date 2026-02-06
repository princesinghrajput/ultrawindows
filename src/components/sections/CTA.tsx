import Link from 'next/link';
import { ArrowRight, LogIn, Phone } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-900">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Ready to Transform Your Home?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                        Get a free, no-obligation quote for your project. Our team is ready to help
                        you choose the perfect doors, windows, or roof products for your home.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/design-quote">
                            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg w-full sm:w-auto">
                                Design & Quote
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </Link>
                        <a
                            href="https://ultra-hazel.vercel.app/login"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-200 text-lg w-full sm:w-auto">
                                <LogIn className="h-5 w-5" />
                                Trade Login
                            </button>
                        </a>
                        <a href="tel:01707932189">
                            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-200 text-lg w-full sm:w-auto">
                                <Phone className="h-5 w-5" />
                                Call Us Now
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
