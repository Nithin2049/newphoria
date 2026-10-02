import React, { useState, useEffect } from 'react';
import {
  DestinationId,
  GeneratedItinerary,
  SavedTrip,
  TripPlanRequest,
} from './types/travel';
import { generatePersonalizedItinerary } from './utils/itineraryEngine';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  saveTripToFirestore,
  loadUserTripsFromFirestore,
  deleteTripFromFirestore,
} from './services/firebaseService';
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
import { AuthModal } from './components/AuthModal';

const SAVED_TRIPS_KEY = 'newphoria_saved_trips';

function MainApp() {
  const { user } = useAuth();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<GeneratedItinerary | null>(null);
  const [plannerDestination, setPlannerDestination] = useState<DestinationId>('goa');
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState<string | undefined>();

  // Sync trips when user auth state changes
  useEffect(() => {
    let isMounted = true;

    async function syncTrips() {
      if (user) {
        setLoadingTrips(true);
        try {
          const cloudTrips = await loadUserTripsFromFirestore(user.uid);
          if (isMounted) {
            setSavedTrips(cloudTrips);
          }
        } catch (err) {
          console.warn('Could not load trips from Firestore, using local fallback:', err);
          if (isMounted) {
            const local = localStorage.getItem(SAVED_TRIPS_KEY);
            setSavedTrips(local ? JSON.parse(local) : []);
          }
        } finally {
          if (isMounted) setLoadingTrips(false);
        }
      } else {
        // Fallback to local storage when not signed in
        try {
          const local = localStorage.getItem(SAVED_TRIPS_KEY);
          setSavedTrips(local ? JSON.parse(local) : []);
        } catch (e) {
          console.error(e);
        }
      }
    }

    syncTrips();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Show transient toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
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
      const yOffset = -75;
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

  // Handle Save Trip to Firestore & Local Storage
  const handleSaveTrip = async (itineraryToSave: GeneratedItinerary) => {
    const isAlreadySaved = savedTrips.some(
      (t) => t.itinerary.id === itineraryToSave.id || t.id === itineraryToSave.id
    );

    if (isAlreadySaved) {
      triggerToast('This itinerary is already in your My Trips collection.');
      return;
    }

    // If user is authenticated, save directly to Firestore
    if (user) {
      try {
        const firestoreId = await saveTripToFirestore(user.uid, itineraryToSave);
        const newTrip: SavedTrip = {
          id: itineraryToSave.id,
          firestoreId,
          userId: user.uid,
          itinerary: itineraryToSave,
          savedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        };
        setSavedTrips((prev) => [newTrip, ...prev]);
        triggerToast(`Saved ${itineraryToSave.destinationName} trip to your Firebase cloud account!`);
      } catch (err: any) {
        console.error('Failed to save to Firestore:', err);
        // Local fallback
        saveLocally(itineraryToSave);
        triggerToast('Saved locally. (Check Firestore rules or network connection)');
      }
    } else {
      // Save locally and prompt for auth
      saveLocally(itineraryToSave);
      setAuthPrompt('Sign in to sync your saved trips to Firebase Firestore across all devices.');
      setAuthModalOpen(true);
      triggerToast(`Saved ${itineraryToSave.destinationName} trip locally. Sign in to sync to cloud!`);
    }
  };

  const saveLocally = (itineraryToSave: GeneratedItinerary) => {
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
    } catch (e) {
      console.error('Storage error', e);
    }
  };

  // Delete trip from Firestore & Local Storage
  const handleDeleteTrip = async (trip: SavedTrip) => {
    try {
      if (user && trip.firestoreId) {
        await deleteTripFromFirestore(user.uid, trip.firestoreId);
      }
      const updated = savedTrips.filter(
        (t) => (t.firestoreId && t.firestoreId !== trip.firestoreId) || t.id !== trip.id
      );
      setSavedTrips(updated);
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
      triggerToast('Trip removed from My Trips.');
    } catch (err: any) {
      console.error('Failed to delete trip:', err);
      const updated = savedTrips.filter((t) => t.id !== trip.id);
      setSavedTrips(updated);
      triggerToast('Trip removed locally.');
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

  const handleSelectDestinationForPlan = (destId: DestinationId) => {
    setPlannerDestination(destId);
    scrollToSection('plan-trip');
  };

  const isCurrentItinerarySaved = currentItinerary
    ? savedTrips.some(
        (t) => t.itinerary.id === currentItinerary.id || t.id === currentItinerary.id
      )
    : false;

  const handleOpenAuth = (prompt?: string) => {
    setAuthPrompt(prompt);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Fixed Sticky Header Navigation */}
      <Navbar
        savedTripsCount={savedTrips.length}
        onNavigate={scrollToSection}
        activeSection={activeNavSection}
        onOpenAuthModal={() => handleOpenAuth()}
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

        {/* My Trips (Stored in Firestore with Local Persistence) */}
        <MyTrips
          savedTrips={savedTrips}
          loading={loadingTrips}
          onViewTrip={handleViewTrip}
          onDeleteTrip={handleDeleteTrip}
          onPlanNewTrip={() => scrollToSection('plan-trip')}
          onOpenAuthModal={() => handleOpenAuth('Sign in to access your cloud-saved itineraries.')}
        />

        {/* Digital Scrapbook Memories Section (Firebase Storage & Firestore) */}
        <MemoriesSection
          onOpenAuthModal={() => handleOpenAuth('Sign in to upload travel photos to Firebase Storage.')}
        />

        {/* Contact Section (Firebase Firestore contactMessages collection) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        promptMessage={authPrompt}
      />

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

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
