import React from 'react';
import { Compass, Sparkles, MapPin, ArrowDown } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <header
      id="hero"
      className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-stone-900"
    >
      {/* Background Image Layer with Atmospheric Mountain Aesthetic */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80')`,
        }}
      />

      {/* Subtle Mist / Atmospheric Mountain Silhouette Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/35 to-stone-950/90 pointer-events-none" />

      {/* Decorative Mountain Contour Vector Overlay at Bottom */}
      <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 1440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto text-stone-950"
        >
          <path
            d="M0 260L160 180L340 220L580 120L780 200L1020 90L1240 190L1440 140V260H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Main Content Container - Flexbox Centered Responsive Layout */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center justify-center text-center">
        {/* Mountain Emblem Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>Personalized Travel Planning & Digital Management</span>
        </div>

        {/* Big Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
          Your All-In-One <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-100 to-stone-300">
            Travel Planner
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl font-light text-stone-200/90 max-w-2xl mb-10 leading-relaxed drop-shadow-sm">
          Plan your trip now! Enter your days, budget, and travel interests to generate a tailored itinerary with verified map locations.
        </p>

        {/* Centered Crimson Red START Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onStartClick}
            id="plan-trip-button"
            className="group relative inline-flex items-center justify-center px-10 py-4 text-base sm:text-lg font-semibold text-white bg-[#f04141] hover:bg-[#d93030] active:scale-95 rounded-md shadow-xl hover:shadow-red-600/30 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2.5 tracking-wider uppercase font-bold">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
              START PLANNING
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Quick Highlights / Destination Badges */}
        <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-3xl">
          {[
            { label: 'Goa', sub: 'Sun & Heritage' },
            { label: 'Gokarna', sub: 'Beaches & Temples' },
            { label: 'Ooty', sub: 'Nilgiri Mountains' },
            { label: 'Pondicherry', sub: 'French Riviera' },
          ].map((dest) => (
            <div
              key={dest.label}
              className="text-center p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-white font-semibold text-sm sm:text-base">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{dest.label}</span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">{dest.sub}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <button
          onClick={onStartClick}
          aria-label="Scroll down to travel planning"
          className="mt-10 text-stone-300 hover:text-white transition-colors animate-bounce cursor-pointer"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
