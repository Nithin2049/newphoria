import React, { useState, useEffect } from 'react';
import {
  DestinationId,
  GeneratedItinerary,
  SavedTrip,
  TripPlanRequest,
} from './types/travel';
import { generatePersonalizedItinerary } from './utils/itineraryEngine';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { DestinationsSection } from './components/DestinationsSection';
import { TripPlanner } from './components/TripPlanner';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { MyTrips } from './components/MyTrips';
import { MemoriesSection } from './components/MemoriesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

const SAVED_TRIPS_KEY = 'newphoria_saved_trips';

export default function App() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<GeneratedItinerary | null>(null);
  const [plannerDestination, setPlannerDestination] = useState<DestinationId>('goa');
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_TRIPS_KEY);
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved trips from localStorage', e);
    }
  }, []);

  // Show transient toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Smooth scroll helper that accounts for fixed navbar offset
  const scrollToSection = (sectionId: string) => {
    setActiveNavSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -75; // Account for 72px fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handle Generate Trip
  const handleGenerateItinerary = (request: TripPlanRequest) => {
    try {
      const generated = generatePersonalizedItinerary(request);
      setCurrentItinerary(generated);
      triggerToast(`Generated customized ${generated.days}-day itinerary for ${generated.destinationName}!`);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('itinerary-results');
        if (resultsEl) {
          const yOffset = -80;
          const y = resultsEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error(err);
      triggerToast('Unable to generate itinerary. Please try again.');
    }
  };

  // Handle Save Trip to localStorage
  const handleSaveTrip = (itineraryToSave: GeneratedItinerary) => {
    const isAlreadySaved = savedTrips.some((t) => t.itinerary.id === itineraryToSave.id);

    if (isAlreadySaved) {
      triggerToast('This itinerary is already in your My Trips collection.');
      return;
    }

    const newSavedTrip: SavedTrip = {
      id: `saved-${Date.now()}`,
      itinerary: itineraryToSave,
      savedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const updated = [newSavedTrip, ...savedTrips];
    setSavedTrips(updated);
    try {
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
      triggerToast(`Saved ${itineraryToSave.destinationName} trip to My Trips!`);
    } catch (e) {
      console.error('Storage error', e);
    }
  };

  // Delete trip
  const handleDeleteTrip = (tripId: string) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    try {
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
      triggerToast('Trip removed from My Trips.');
    } catch (e) {
      console.error(e);
    }
  };

  // View trip from My Trips
  const handleViewTrip = (itinerary: GeneratedItinerary) => {
    setCurrentItinerary(itinerary);
    setTimeout(() => {
      const resultsEl = document.getElementById('itinerary-results');
      if (resultsEl) {
        const yOffset = -80;
        const y = resultsEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  // When a destination card clicks "Plan Trip Here"
  const handleSelectDestinationForPlan = (destId: DestinationId) => {
    setPlannerDestination(destId);
    scrollToSection('plan-trip');
  };

  const isCurrentItinerarySaved = currentItinerary
    ? savedTrips.some((t) => t.itinerary.id === currentItinerary.id)
    : false;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Fixed Sticky Header Navigation */}
      <Navbar
        savedTripsCount={savedTrips.length}
        onNavigate={scrollToSection}
        activeSection={activeNavSection}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section with Parallax Atmosphere & START Button */}
        <Hero onStartClick={() => scrollToSection('plan-trip')} />

        {/* Services We Provide (Real, Non-Misleading Features) */}
        <Services />

        {/* Curated Top Destinations (Goa, Gokarna, Ooty, Pondicherry) */}
        <DestinationsSection
          onSelectDestinationForPlan={handleSelectDestinationForPlan}
        />

        {/* Plan Your Trip Main Feature */}
        <TripPlanner
          key={plannerDestination}
          initialDestination={plannerDestination}
          onGenerateItinerary={handleGenerateItinerary}
        />

        {/* Generated Personalized Itinerary & Budget Breakdown */}
        {currentItinerary && (
          <ItineraryDisplay
            itinerary={currentItinerary}
            onSaveTrip={handleSaveTrip}
            isSaved={isCurrentItinerarySaved}
            onScrollToPlanner={() => scrollToSection('plan-trip')}
          />
        )}

        {/* My Trips (Stored in LocalStorage) */}
        <MyTrips
          savedTrips={savedTrips}
          onViewTrip={handleViewTrip}
          onDeleteTrip={handleDeleteTrip}
          onPlanNewTrip={() => scrollToSection('plan-trip')}
        />

        {/* Digital Scrapbook Memories Section */}
        <MemoriesSection />

        {/* Contact Section with Firebase Realtime Database Config */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#f04141] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
