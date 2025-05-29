import React from 'react';

interface MarqueeProps {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
    children,
    direction = 'left',
    className = '',
}) => {
    return (
        <div className={`marquee-container ${className}`}>
            <div className={`marquee-content ${direction}`}>
                {children}
                {children}
            </div>
        </div>
    );
}; 