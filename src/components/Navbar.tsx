import React, { useState, useEffect } from 'react';
import { Mountain, Menu, X, Compass, Calendar, Heart, MessageSquare, MapPin, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  savedTripsCount: number;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedTripsCount,
  onNavigate,
  activeSection,
  onOpenAuthModal,
}) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'destinations', label: 'DESTINATIONS', icon: MapPin },
    { id: 'plan-trip', label: 'PLAN TRIP', icon: Compass },
    { id: 'my-trips', label: 'MY TRIPS', count: savedTripsCount, icon: Calendar },
    { id: 'memories', label: 'MEMORIES', icon: Heart },
    { id: 'contact', label: 'CONTACT', icon: MessageSquare },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5 border-b border-stone-200/80 text-stone-800'
          : 'bg-black/30 backdrop-blur-md py-5 border-b border-white/10 text-white'
      }`}
      style={{ willChange: 'background-color, padding, box-shadow' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isScrolled
                  ? 'bg-rose-50 text-red-600 border border-red-200'
                  : 'bg-white/15 text-white border border-white/20'
              }`}
            >
              <Mountain className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span
                className={`text-xl font-bold tracking-widest font-sans transition-colors ${
                  isScrolled ? 'text-stone-900' : 'text-white'
                }`}
              >
                NEWPHORIA
              </span>
              <span
                className={`hidden sm:block text-[10px] uppercase tracking-wider ${
                  isScrolled ? 'text-stone-500' : 'text-stone-300'
                }`}
              >
                Travel Planning System
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-3 py-2 rounded-md text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isScrolled
                      ? isActive
                        ? 'text-red-600 bg-red-50/80'
                        : 'text-stone-700 hover:text-red-600 hover:bg-stone-100/70'
                      : isActive
                      ? 'text-white bg-white/20'
                      : 'text-stone-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#f04141] text-white rounded-full">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#f04141] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Auth Button */}
            <div className="pl-2 border-l border-stone-300/30">
              {user ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      isScrolled
                        ? 'bg-stone-100 text-stone-800 border-stone-200'
                        : 'bg-white/15 text-white border-white/25'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#f04141] text-white flex items-center justify-center text-[10px] uppercase font-bold">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <span className="max-w-[90px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isScrolled
                        ? 'text-stone-500 hover:text-red-600 hover:bg-red-50'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isScrolled
                      ? 'bg-stone-900 hover:bg-stone-800 text-white'
                      : 'bg-white hover:bg-stone-100 text-stone-900'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>SIGN IN</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <button
                onClick={onOpenAuthModal}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                  isScrolled ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'
                }`}
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer focus:outline-none ${
                isScrolled
                  ? 'text-stone-800 hover:bg-stone-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 text-stone-900 border-b border-stone-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Mobile User Profile */}
          {user ? (
            <div className="p-3 bg-stone-100 rounded-xl mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f04141] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {user.displayName || 'Traveler'}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate max-w-[170px]">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-red-50 text-red-600 rounded text-xs font-bold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mb-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold tracking-wider flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-bold border-l-4 border-red-500'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-stone-500" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#f04141] text-white rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};

