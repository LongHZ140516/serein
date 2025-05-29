'use client'

import React, { useState, useEffect } from "react";
import { getAllPhotos, type Theme, type PhotoConfig } from "@/content/photos/auto-photos";
import { Images } from 'lucide-react';

const CARD_OFFSET = 6;
const ROTATION_FACTOR = 8;

interface Card extends PhotoConfig {
  rotation: number;
  isLoaded: boolean;
  hasError: boolean;
}

interface CardStackProps {
  cardOffset?: number;
  rotationFactor?: number;
  maxPhotos?: number;
  useAutoGeneration?: boolean;
}

const CardStack: React.FC<CardStackProps> = ({ 
  cardOffset = CARD_OFFSET, 
  rotationFactor = ROTATION_FACTOR,
  maxPhotos = 6,
  useAutoGeneration = true
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [cards, setCards] = useState<Card[]>([]);

  // Monitor theme changes
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Update cards when theme changes
  useEffect(() => {
    const allPhotos = getAllPhotos(useAutoGeneration, maxPhotos);
    const currentPhotos = allPhotos[theme];
    
    console.log('Current theme:', theme);
    console.log('Photos for theme:', currentPhotos);
    
    const initialCards = currentPhotos.map((photo, index) => ({
      ...photo,
      rotation: (index % 2 === 0 ? 1 : -1) * rotationFactor * (0.5 + Math.random() * 0.5),
      isLoaded: false,
      hasError: false
    }));

    setCards(initialCards);
  }, [theme, rotationFactor, maxPhotos, useAutoGeneration]);

  const moveToEnd = (from: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const item = newCards.splice(from, 1)[0];
      // Add new random rotation when moved to end
      item.rotation = (Math.random() > 0.5 ? 1 : -1) * rotationFactor * (0.5 + Math.random() * 0.5);
      newCards.push(item);
      return newCards;
    });
  };

  const handleImageLoad = (cardId: number) => {
    console.log('Image loaded successfully:', cardId);
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, isLoaded: true } : card
      )
    );
  };

  const handleImageError = (cardId: number, imagePath: string) => {
    console.log('Image failed to load:', cardId, imagePath);
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, hasError: true } : card
      )
    );
  };

  // Filter out cards that failed to load
  const validCards = cards.filter(card => !card.hasError);

  return (
    <div className='relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-xl p-4 lg:p-6'>
      {/* <div className='flex z-20 items-center gap-2'>
        <Images className='size-[15px]' />
        <h2 className='text-sm font-light'>Gallery</h2>
      </div> */}
      
      <div className="flex-1 flex justify-center items-center relative">
        <ul className="relative w-full h-full flex justify-center items-center">
          {validCards.map((card, index) => (
            <li
              key={`${theme}-${card.id}`}
              className="absolute origin-center list-none rounded-lg cursor-grab active:cursor-grabbing transition-transform duration-300 hover:scale-105"
              style={{
                zIndex: validCards.length - index,
                transform: `translateY(${index * -cardOffset}px) rotate(${card.rotation}deg)`,
              }}
              onClick={() => moveToEnd(index)}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-border/20 shadow-lg">
                <img
                  alt={card.alt}
                  className={`object-cover w-[180px] h-[180px] md:w-[200px] md:h-[200px] transition-opacity duration-300 ${
                    card.isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  src={card.imagePath}
                  loading="lazy"
                  onLoad={() => handleImageLoad(card.id)}
                  onError={() => handleImageError(card.id, card.imagePath)}
                />
                {!card.isLoaded && !card.hasError && (
                  <div className="absolute inset-0 bg-muted animate-pulse rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            </li>
          ))}
        </ul>
        
        {validCards.length === 0 && (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Images className="size-12 mb-2 opacity-50" />
            <p className="text-sm text-center">
              No images found<br />
              <span className="text-xs">Add images to /public/images/{theme}/</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardStack; 