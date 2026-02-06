'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    className?: string;
}

export const Reveal = ({ children, width = 'fit-content', delay = 0, className = '' }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Optional: Unobserve after it becomes visible if you only want it to animate once
                    // observer.unobserve(ref.current);
                }
            },
            {
                root: null, // relative to document viewport
                rootMargin: '0px', // margin all around the root
                threshold: 0.1 // percentage of target's visibility the observer's callback should be executed
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []); // Empty array ensures this effect runs only once

    return (
        <div
            ref={ref}
            style={{ width }}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                style={{
                    transitionDelay: `${delay}ms`,
                    transitionDuration: '1000ms', // Adjust duration as needed
                    transitionProperty: 'transform, opacity',
                    transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth ease-out
                }}
                className={`transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                {children}
            </div>
        </div>
    );
};
