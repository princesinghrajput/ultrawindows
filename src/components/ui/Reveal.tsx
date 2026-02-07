'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type AnimationType =
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'zoom-in'
    | 'zoom-out'
    | 'flip-up'
    | 'slide-up'
    | 'blur-in'
    | 'scale-up';

interface RevealProps {
    children: ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    duration?: number;
    className?: string;
    animation?: AnimationType;
    once?: boolean; // Whether to animate only once
    threshold?: number; // Visibility threshold (0-1)
    easing?: string;
}

// Animation configurations
const animations: Record<AnimationType, { initial: string; visible: string; styles: React.CSSProperties }> = {
    'fade-up': {
        initial: 'translate-y-12 opacity-0',
        visible: 'translate-y-0 opacity-100',
        styles: {}
    },
    'fade-down': {
        initial: '-translate-y-12 opacity-0',
        visible: 'translate-y-0 opacity-100',
        styles: {}
    },
    'fade-left': {
        initial: 'translate-x-12 opacity-0',
        visible: 'translate-x-0 opacity-100',
        styles: {}
    },
    'fade-right': {
        initial: '-translate-x-12 opacity-0',
        visible: 'translate-x-0 opacity-100',
        styles: {}
    },
    'zoom-in': {
        initial: 'scale-90 opacity-0',
        visible: 'scale-100 opacity-100',
        styles: {}
    },
    'zoom-out': {
        initial: 'scale-110 opacity-0',
        visible: 'scale-100 opacity-100',
        styles: {}
    },
    'flip-up': {
        initial: 'opacity-0',
        visible: 'opacity-100',
        styles: {}
    },
    'slide-up': {
        initial: 'translate-y-full opacity-0',
        visible: 'translate-y-0 opacity-100',
        styles: {}
    },
    'blur-in': {
        initial: 'opacity-0',
        visible: 'opacity-100',
        styles: {}
    },
    'scale-up': {
        initial: 'scale-95 opacity-0',
        visible: 'scale-100 opacity-100',
        styles: {}
    }
};

export const Reveal = ({
    children,
    width = 'fit-content',
    delay = 0,
    duration = 800,
    className = '',
    animation = 'fade-up',
    once = true,
    threshold = 0.15,
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)' // Custom smooth easing
}: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setHasAnimated(true);
                    if (once && currentRef) {
                        observer.unobserve(currentRef);
                    }
                } else if (!once && hasAnimated) {
                    setIsVisible(false);
                }
            },
            {
                root: null,
                rootMargin: '-50px 0px -50px 0px', // Trigger slightly before/after viewport
                threshold: threshold
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [once, hasAnimated, threshold]);

    const config = animations[animation];

    // Special styles for blur-in animation
    const blurStyles: React.CSSProperties = animation === 'blur-in'
        ? { filter: isVisible ? 'blur(0px)' : 'blur(10px)' }
        : {};

    // Special styles for flip-up animation
    const flipStyles: React.CSSProperties = animation === 'flip-up'
        ? {
            transform: isVisible ? 'perspective(1000px) rotateX(0deg)' : 'perspective(1000px) rotateX(-15deg)',
            transformOrigin: 'bottom center'
        }
        : {};

    return (
        <div
            ref={ref}
            style={{ width }}
            className={`relative ${className}`}
        >
            <div
                style={{
                    transitionDelay: `${delay}ms`,
                    transitionDuration: `${duration}ms`,
                    transitionProperty: 'transform, opacity, filter',
                    transitionTimingFunction: easing,
                    willChange: 'transform, opacity',
                    ...blurStyles,
                    ...flipStyles,
                    ...config.styles
                }}
                className={`transform ${isVisible ? config.visible : config.initial}`}
            >
                {children}
            </div>
        </div>
    );
};

// Stagger container for staggered children animations
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    baseDelay?: number;
}

export const StaggerContainer = ({
    children,
    className = '',
    staggerDelay = 100,
    baseDelay = 0
}: StaggerContainerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (currentRef) {
                        observer.unobserve(currentRef);
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '-30px 0px'
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={ref} className={className}>
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <div
                        key={index}
                        style={{
                            transitionDelay: `${baseDelay + (index * staggerDelay)}ms`,
                            transitionDuration: '600ms',
                            transitionProperty: 'transform, opacity',
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className={`transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        {child}
                    </div>
                ))
                : children
            }
        </div>
    );
};

// Parallax component for subtle scroll effects
interface ParallaxProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

export const Parallax = ({ children, speed = 0.5, className = '' }: ParallaxProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            setOffset((scrollProgress - 0.5) * speed * 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <div
                style={{
                    transform: `translateY(${offset}px)`,
                    transition: 'transform 0.1s linear'
                }}
            >
                {children}
            </div>
        </div>
    );
};

// Text reveal animation - reveals text character by character or word by word
interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    type?: 'char' | 'word';
}

export const TextReveal = ({ text, className = '', delay = 0, type = 'word' }: TextRevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (currentRef) {
                        observer.unobserve(currentRef);
                    }
                }
            },
            { threshold: 0.2 }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const elements = type === 'word' ? text.split(' ') : text.split('');

    return (
        <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
            {elements.map((element, index) => (
                <span
                    key={index}
                    style={{
                        transitionDelay: `${delay + (index * (type === 'word' ? 80 : 30))}ms`,
                        transitionDuration: '500ms',
                        transitionProperty: 'transform, opacity',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className={`inline-block transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                    {element}{type === 'word' && index < elements.length - 1 ? '\u00A0' : ''}
                </span>
            ))}
        </div>
    );
};
