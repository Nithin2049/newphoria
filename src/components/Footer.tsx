import React from 'react';
import { Mountain, Instagram, Mail, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-white pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800/80">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 text-[#f04141] flex items-center justify-center">
                <Mountain className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-widest">NEWPHORIA</span>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Personalized Travel Planning and Digital Travel Management System. Crafted for wanderers seeking seamless itineraries, accurate local budgeting, and vivid memory archiving.
            </p>
            <p className="text-xs text-stone-500">Bengaluru, Karnataka, India</p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Destinations (Goa, Gokarna, Ooty, Pondicherry)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plan-trip')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trip Planner & Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-trips')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Saved Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('memories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Digital Memories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Goa – Western Coast</li>
              <li>Gokarna – Arabian Sea Temple Beach</li>
              <li>Ooty – Nilgiri Mountain Retreat</li>
              <li>Pondicherry – French Colonial Coast</li>
            </ul>

            <div className="mt-5 flex items-center space-x-3 text-stone-400">
              <a
                href="https://www.instagram.com/vipulreddy15/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} NEWPHORIA Mini-Project. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Built with precision for travelers</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
