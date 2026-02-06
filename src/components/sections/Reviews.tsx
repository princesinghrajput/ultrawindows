'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, CircleCheck, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const reviews = [
    {
        id: 1,
        type: 'trustpilot',
        rating: 5,
        text: 'Excellent service and product. Doors supplied on time and well packaged. Helpful delivery service and the doors fit like a glove. Future orders coming to you.',
        author: 'Verified Customer',
        role: 'Trustpilot Review',
        date: 'January 2026',
        initials: 'VC',
    },
    {
        id: 2,
        type: 'trustpilot',
        rating: 5,
        text: 'I recently had new windows and bi-fold doors delivered by Ultra Windows & Bifolds, and I couldn\'t be happier with the result. The team was professional and helpful.',
        author: 'Verified Customer',
        role: 'Trustpilot Review',
        date: 'January 2026',
        initials: 'VC',
    },
    {
        id: 3,
        type: 'trade',
        rating: 5,
        text: 'As an installer, I\'ve worked with many suppliers but Ultra Windows stands out. Quick turnaround times, consistent quality. A trusted partner for our business.',
        author: 'Mark Richardson',
        role: 'Installation Contractor',
        initials: 'MR',
    },
    {
        id: 4,
        type: 'trade',
        rating: 5,
        text: 'The adjustable hinges and easy-fit hardware make installations straightforward. We\'ve cut our fitting time significantly since switching to Ultra Windows.',
        author: 'Steve Patterson',
        role: 'Specialist Installer',
        initials: 'SP',
    },
    {
        id: 5,
        type: 'trade',
        rating: 5,
        text: 'Reliable lead times and excellent build quality. Our clients are always impressed with the finished product. Ultra Windows is our go-to supplier.',
        author: 'Gary Wilson',
        role: 'Building Contractor',
        initials: 'GW',
    },
    {
        id: 6,
        type: 'customer',
        rating: 5,
        text: 'Absolutely delighted with our new bifold doors. The quality is outstanding and the installation guidance was incredibly helpful. Highly recommend!',
        author: 'Sarah Thompson',
        role: 'Manchester',
        initials: 'ST',
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 md:h-5 md:w-5 ${i < rating ? 'fill-orange-400 text-orange-400' : 'fill-slate-200 text-slate-200'}`}
                />
            ))}
        </div>
    );
}

function TrustpilotStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center ${i < rating ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                    <Star className="h-3.5 w-3.5 md:h-4 md:w-4 fill-white text-white" />
                </div>
            ))}
        </div>
    );
}

interface ReviewCardProps {
    review: typeof reviews[0];
}

function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-orange-500/10 transition-all duration-500 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity duration-500 bg-orange-50 rounded-bl-3xl">
                <Quote className="h-8 w-8 text-orange-500" />
            </div>

            {/* Badge */}
            <div className="mb-6">
                <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${review.type === 'trustpilot'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                    {review.type === 'trustpilot' ? (
                        <>
                            <Star className="h-3 w-3 fill-current" />
                            Verified Trustpilot
                        </>
                    ) : (
                        <>
                            <CircleCheck className="h-3 w-3" />
                            Trade Partner
                        </>
                    )}
                </span>
            </div>

            {/* Stars */}
            <div className="mb-4">
                <StarRating rating={review.rating} />
            </div>

            {/* Review Text */}
            <p className="text-slate-700 mb-8 relative z-10 font-medium text-base md:text-lg leading-relaxed flex-grow">
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-heading font-bold text-sm md:text-base">
                    {review.initials}
                </div>
                <div className="min-w-0">
                    <p className="font-heading font-bold text-slate-900 truncate text-sm md:text-base">{review.author}</p>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide truncate">{review.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 1024) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, reviews.length - slidesPerView);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }, [maxIndex]);

    return (
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <Reveal width="100%">
                        <div className="flex flex-col items-center">
                            <span className="inline-block text-orange-500 font-bold text-xs md:text-sm uppercase tracking-widest mb-3">
                                Verified Reviews
                            </span>
                            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                                Trusted by Customers <br className="hidden md:block" /> & Trade Partners
                            </h2>
                            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
                                Real feedback from homeowners and professional installers who choose Ultra Windows
                                for their premium projects.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Trustpilot Summary Card */}
                <Reveal delay={200} width="100%">
                    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 md:mb-16 max-w-5xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full lg:w-auto">
                                <div className="bg-[#00b67a] text-white font-bold px-6 py-3 rounded-xl text-lg shadow-lg shadow-emerald-500/20 flex items-center gap-2 w-full sm:w-auto justify-center">
                                    <Star className="fill-white h-5 w-5" />
                                    Trustpilot
                                </div>
                                <div className="flex items-center gap-4 md:gap-6 justify-center w-full sm:w-auto">
                                    <TrustpilotStars rating={5} />
                                    <div className="text-center md:text-left">
                                        <div className="font-heading font-bold text-slate-900 text-2xl">4.8</div>
                                        <div className="text-slate-500 text-sm font-medium">Excellent</div>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200 hidden md:block" />
                                    <div className="text-slate-500 text-sm hidden md:block">
                                        Based on <strong className="text-slate-900">120+ reviews</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 w-full sm:w-auto justify-center">
                                    <CircleCheck className="h-4 w-4 text-emerald-500" />
                                    <span>Verified Company</span>
                                </div>
                                <a
                                    href="https://www.trustpilot.com/review/ultrawindows.co.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all duration-200 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
                                >
                                    See All Reviews
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Reviews Carousel */}
                <Reveal delay={400} width="100%">
                    <div className="relative max-w-6xl mx-auto md:px-12">
                        <div className="overflow-hidden px-1 md:px-0 py-4 -my-4">
                            <div
                                className="flex transition-transform duration-500 ease-out gap-6"
                                style={{ transform: `translateX(calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * 24 / slidesPerView}px))` }}
                            >
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="flex-shrink-0"
                                        style={{ width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 24 / slidesPerView}px)` }}
                                    >
                                        <ReviewCard review={review} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={goToPrev}
                            disabled={currentIndex === 0}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-white border border-slate-200 shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 z-10"
                            aria-label="Previous reviews"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={currentIndex >= maxIndex}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-white border border-slate-200 shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 z-10"
                            aria-label="Next reviews"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </Reveal>

                {/* Dots for Mobile */}
                <div className="flex justify-center gap-2 mt-8 md:hidden">
                    {[...Array(Math.ceil(reviews.length / slidesPerView))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i * slidesPerView)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${Math.floor(currentIndex / slidesPerView) === i ? 'bg-orange-500 w-8' : 'bg-slate-300'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
