import React from 'react';
import { SavedTrip, GeneratedItinerary } from '../types/travel';
import { formatINR } from '../utils/itineraryEngine';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Trash2,
  ExternalLink,
  MapPin,
  Compass,
  Cloud,
  CloudCheck,
  Lock,
  Loader2,
} from 'lucide-react';

interface MyTripsProps {
  savedTrips: SavedTrip[];
  loading?: boolean;
  onViewTrip: (itinerary: GeneratedItinerary) => void;
  onDeleteTrip: (trip: SavedTrip) => void;
  onPlanNewTrip: () => void;
  onOpenAuthModal?: () => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({
  savedTrips,
  loading = false,
  onViewTrip,
  onDeleteTrip,
  onPlanNewTrip,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();

  return (
    <section id="my-trips" className="py-20 bg-stone-50 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-[#f04141] font-bold">
                Cloud Synchronized
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                <Cloud className="w-3 h-3 text-emerald-600" />
                Firestore
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              My Saved Trips
            </h2>
            <p className="mt-2 text-stone-600 text-sm">
              Review and manage your generated itineraries. Stored in Firebase Firestore cloud database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedTrips.length > 0 && (
              <button
                onClick={onPlanNewTrip}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f04141] hover:bg-[#d93030] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>PLAN ANOTHER TRIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Not Signed In Banner */}
        {!user && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Cloud Sync Notice:</strong> Sign in with your NEWPHORIA account to store and access your private itineraries securely via Firebase Firestore across devices!
              </span>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="shrink-0 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-stone-200">
            <Loader2 className="w-8 h-8 text-[#f04141] animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-600">Loading trips from Firestore...</p>
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No Saved Trips Yet</h3>
            <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
              You haven't saved any itineraries to the cloud yet. Head to the planner to create and save your personalized vacation plan.
            </p>
            <button
              onClick={onPlanNewTrip}
              className="px-6 py-3 bg-[#f04141] hover:bg-[#d93030] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Start Planning Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((item) => {
              const { itinerary } = item;
              return (
                <div
                  key={item.firestoreId || item.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#f04141]">
                          <MapPin className="w-3.5 h-3.5" />
                          {itinerary.destinationName}
                        </span>
                        <h4 className="text-xl font-bold text-stone-900 mt-0.5">
                          {itinerary.days} {itinerary.days === 1 ? 'Day Escape' : 'Days Tour'}
                        </h4>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                        {itinerary.travelStyle}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="space-y-2.5 py-3 border-y border-stone-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Planned Budget:</span>
                        <span className="font-semibold text-stone-800">
                          {formatINR(itinerary.budget)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Estimated Cost:</span>
                        <span className="font-bold text-stone-900">
                          {formatINR(itinerary.budgetBreakdown.totalEstimatedCost)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Saved Date:</span>
                        <span className="text-stone-600 font-mono">
                          {item.savedAt}
                        </span>
                      </div>
                    </div>

                    {/* Interests tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {itinerary.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewTrip(itinerary)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>VIEW TRIP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete saved trip for ${itinerary.destinationName}?`)) {
                          onDeleteTrip(item);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Trip"
                      aria-label="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

