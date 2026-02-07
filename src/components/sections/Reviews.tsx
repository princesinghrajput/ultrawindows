'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
                    className={`h-4 w-4 ${i < rating ? 'fill-orange-400 text-orange-400' : 'fill-slate-200 text-slate-200'}`}
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
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center ${i < rating ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fill-white text-white" />
                </div>
            ))}
        </div>
    );
}

interface ReviewCardProps {
    review: typeof reviews[0];
    isMobile?: boolean;
}

function ReviewCard({ review, isMobile = false }: ReviewCardProps) {
    return (
        <div className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-500/20 transition-all duration-500 h-full flex flex-col relative overflow-hidden group ${isMobile ? 'mx-1' : ''}`}>
            {/* Quote decoration */}
            <div className="absolute -top-2 -right-2 p-4 sm:p-6 opacity-[0.08] group-hover:opacity-20 transition-opacity duration-500">
                <Quote className="h-12 w-12 sm:h-16 sm:w-16 text-orange-500" />
            </div>

            {/* Badge */}
            <div className="mb-4 sm:mb-5">
                <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold px-2.5 sm:px-3 py-1 rounded-full border ${review.type === 'trustpilot'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : review.type === 'trade'
                        ? 'bg-orange-50 text-orange-700 border-orange-100'
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                    {review.type === 'trustpilot' ? (
                        <>
                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                            Verified Trustpilot
                        </>
                    ) : review.type === 'trade' ? (
                        <>
                            <CircleCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            Trade Partner
                        </>
                    ) : (
                        <>
                            <CircleCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            Verified Homeowner
                        </>
                    )}
                </span>
            </div>

            {/* Stars */}
            <div className="mb-3 sm:mb-4">
                <StarRating rating={review.rating} />
            </div>

            {/* Review Text */}
            <p className="text-slate-700 mb-6 sm:mb-8 relative z-10 font-medium text-sm sm:text-base md:text-lg leading-relaxed flex-grow">
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-100 mt-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-heading font-bold text-xs sm:text-sm md:text-base">
                    {review.initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-heading font-bold text-slate-900 truncate text-sm sm:text-base">{review.author}</p>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide truncate">{review.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
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

    // Reset currentIndex when slidesPerView changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [slidesPerView]);

    const maxIndex = Math.max(0, reviews.length - slidesPerView);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }, [maxIndex]);

    // Touch/drag handlers for mobile swipe
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
        setScrollLeft(currentIndex);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
        setScrollLeft(currentIndex);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (containerRef.current?.offsetLeft || 0);
        const walk = (startX - x) / 200;
        const newIndex = Math.round(scrollLeft + walk);
        if (newIndex >= 0 && newIndex <= maxIndex) {
            setCurrentIndex(newIndex);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
        const walk = (startX - x) / 100;
        const newIndex = Math.round(scrollLeft + walk);
        if (newIndex >= 0 && newIndex <= maxIndex) {
            setCurrentIndex(newIndex);
        }
    };

    return (
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <Reveal width="100%" animation="fade-up">
                        <div className="flex flex-col items-center">
                            <span className="inline-flex items-center gap-2 text-orange-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">
                                <div className="w-8 h-px bg-orange-500/50" />
                                Verified Reviews
                                <div className="w-8 h-px bg-orange-500/50" />
                            </span>
                            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight px-4">
                                Trusted by Customers <br className="hidden sm:block" /> & Trade Partners
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4">
                                Real feedback from homeowners and professional installers who choose Ultra Windows
                                for their premium projects.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Trustpilot Summary Card */}
                <Reveal delay={200} width="100%">
                    <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10 sm:mb-12 md:mb-16 max-w-5xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            {/* Left side - Trustpilot info */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
                                <div className="bg-[#00b67a] text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-base sm:text-lg shadow-lg shadow-emerald-500/20 flex items-center gap-2 w-full sm:w-auto justify-center">
                                    <Star className="fill-white h-4 w-4 sm:h-5 sm:w-5" />
                                    Trustpilot
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                    <TrustpilotStars rating={5} />
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="text-center sm:text-left">
                                            <div className="font-heading font-bold text-slate-900 text-xl sm:text-2xl">4.8</div>
                                            <div className="text-slate-500 text-xs sm:text-sm font-medium">Excellent</div>
                                        </div>
                                        <div className="hidden sm:block h-10 w-px bg-slate-200" />
                                        <div className="hidden sm:block text-slate-500 text-sm">
                                            Based on <strong className="text-slate-900">120+ reviews</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 px-3 sm:px-4 py-2 rounded-full border border-slate-100 w-full sm:w-auto justify-center">
                                    <CircleCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                                    <span>Verified Company</span>
                                </div>
                                <a
                                    href="https://www.trustpilot.com/review/ultrawindows.co.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all duration-200 text-xs sm:text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
                                >
                                    See All Reviews
                                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Mobile-only review count */}
                        <div className="sm:hidden mt-4 pt-4 border-t border-slate-100 text-center">
                            <span className="text-slate-500 text-sm">
                                Based on <strong className="text-slate-900">120+ reviews</strong>
                            </span>
                        </div>
                    </div>
                </Reveal>

                {/* Reviews Carousel */}
                <Reveal delay={400} width="100%">
                    <div className="relative max-w-6xl mx-auto">
                        {/* Desktop Navigation Arrows */}
                        <button
                            onClick={goToPrev}
                            disabled={currentIndex === 0}
                            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-white border border-slate-200 shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 z-10"
                            aria-label="Previous reviews"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={currentIndex >= maxIndex}
                            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-white border border-slate-200 shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 z-10"
                            aria-label="Next reviews"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Carousel Container */}
                        <div
                            ref={containerRef}
                            className="overflow-hidden px-0 sm:px-2 md:px-8 py-4 -my-4"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onTouchMove={handleTouchMove}
                        >
                            <div
                                className={`flex transition-transform duration-500 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{
                                    transform: `translateX(calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * (slidesPerView === 1 ? 16 : 24) / slidesPerView}px))`,
                                    gap: slidesPerView === 1 ? '16px' : '24px'
                                }}
                            >
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="flex-shrink-0"
                                        style={{
                                            width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * (slidesPerView === 1 ? 16 : 24) / slidesPerView}px)`
                                        }}
                                    >
                                        <ReviewCard review={review} isMobile={slidesPerView === 1} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Navigation Dots */}
                <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
                    {/* Mobile swipe hint */}
                    <span className="text-xs text-slate-400 mr-3 sm:hidden">Swipe</span>

                    {[...Array(maxIndex + 1)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i
                                ? 'bg-orange-500 w-6 sm:w-8'
                                : 'bg-slate-300 w-2 hover:bg-slate-400'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}

                    {/* Mobile swipe hint */}
                    <span className="text-xs text-slate-400 ml-3 sm:hidden">to see more</span>
                </div>

                {/* Mobile Navigation Arrows */}
                <div className="flex justify-center gap-3 mt-4 sm:hidden">
                    <button
                        onClick={goToPrev}
                        disabled={currentIndex === 0}
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-white border border-slate-200 shadow-md active:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous review"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={currentIndex >= maxIndex}
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-white border border-slate-200 shadow-md active:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next review"
                    >
                        <ChevronRight className="h-5 w-5 text-slate-600" />
                    </button>
                </div>
            </div>
        </section>
    );
}
