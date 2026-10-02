import React, { useState } from 'react';
import { DestinationId, DestinationInfo } from '../types/travel';
import { DESTINATIONS_DATA } from '../data/destinations';
import {
  MapPin,
  Clock,
  Compass,
  X,
  ExternalLink,
  Car,
  Plane,
  Train,
  Bus,
  CheckCircle,
  Calendar,
} from 'lucide-react';

interface DestinationsSectionProps {
  onSelectDestinationForPlan: (destinationId: DestinationId) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onSelectDestinationForPlan,
}) => {
  const [selectedDestModal, setSelectedDestModal] = useState<DestinationInfo | null>(null);
  const [modalActiveDay, setModalActiveDay] = useState<1 | 2 | 3>(1);

  const destinationsList = Object.values(DESTINATIONS_DATA);

  const handleOpenModal = (dest: DestinationInfo) => {
    setSelectedDestModal(dest);
    setModalActiveDay(1);
  };

  const handlePlanFromModal = (destId: DestinationId) => {
    setSelectedDestModal(null);
    onSelectDestinationForPlan(destId);
  };

  return (
    <section id="destinations" className="py-20 bg-white border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-[#f04141] font-bold mb-2">
            Curated Hubs
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Explore Our Top Destinations
          </h2>
          <p className="mt-3 text-base text-stone-600">
            From the sun-soaked coasts of Goa and Gokarna to the misty tea ridges of Ooty and the colonial quarters of Pondicherry.
          </p>
        </div>

        {/* 4 Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinationsList.map((dest) => (
            <div
              key={dest.id}
              className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Hero Image Container */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Destination Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {dest.state}
                    </span>
                  </div>

                  {/* Name and Tagline */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {dest.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-1">
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7">
                  <p className="text-sm text-stone-600 leading-relaxed mb-5 line-clamp-3">
                    {dest.description}
                  </p>

                  {/* Major Attractions List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2.5">
                      Major Attractions
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.majorAttractions.map((attraction, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs bg-white text-stone-700 border border-stone-200 shadow-2xs font-medium"
                        >
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 flex items-center justify-between gap-4 border-t border-stone-200/60 mt-4">
                <button
                  onClick={() => handleOpenModal(dest)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  VIEW DESTINATION
                </button>

                <button
                  onClick={() => onSelectDestinationForPlan(dest.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f04141] hover:text-[#d93030] transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Plan Trip Here</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Destination Detail Modal */}
      {selectedDestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-200">
            {/* Modal Header Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedDestModal.heroImage}
                alt={selectedDestModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

              <button
                onClick={() => setSelectedDestModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  {selectedDestModal.state}
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  {selectedDestModal.name}
                </h3>
                <p className="text-sm text-stone-200 mt-1 max-w-2xl">
                  {selectedDestModal.tagline}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Description & Quick Stats */}
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-2">Overview</h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {selectedDestModal.description}
                </p>

                <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-stone-500">Best Season to Visit:</span>
                    <span className="ml-1.5 font-bold text-stone-800">
                      {selectedDestModal.bestTimeToVisit}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">Avg. Stay (per night):</span>
                    <span className="ml-1.5 font-bold text-stone-900">
                      ~ ₹{selectedDestModal.avgDailyStayCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transit & Commute Info */}
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#f04141]" />
                  <span>Transit & Commute Guidance</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedDestModal.transit.nearestAirport && (
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Plane className="w-3.5 h-3.5 text-blue-600" />
                        <span>Airport Access</span>
                      </div>
                      <p className="text-stone-600">{selectedDestModal.transit.nearestAirport}</p>
                      {selectedDestModal.transit.flightsNote && (
                        <p className="text-stone-500 mt-1">{selectedDestModal.transit.flightsNote}</p>
                      )}
                    </div>
                  )}

                  {selectedDestModal.transit.trainStation && (
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Train className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Railway Station</span>
                      </div>
                      <p className="text-stone-600">{selectedDestModal.transit.trainStation}</p>
                      {selectedDestModal.transit.trainNote && (
                        <p className="text-stone-500 mt-1">{selectedDestModal.transit.trainNote}</p>
                      )}
                    </div>
                  )}

                  {selectedDestModal.transit.busNote && (
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Bus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bus Routes</span>
                      </div>
                      <p className="text-stone-600">{selectedDestModal.transit.busNote}</p>
                    </div>
                  )}

                  {selectedDestModal.transit.rentalsNote && (
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Car className="w-3.5 h-3.5 text-purple-600" />
                        <span>Vehicle Rentals</span>
                      </div>
                      <p className="text-stone-600">{selectedDestModal.transit.rentalsNote}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 1 / 2 / 3 Day Preview Schedules from Original Pages */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#f04141]" />
                    <span>Curated Day Plan Previews</span>
                  </h4>
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                    {[1, 2, 3].map((d) => (
                      <button
                        key={d}
                        onClick={() => setModalActiveDay(d as 1 | 2 | 3)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                          modalActiveDay === d
                            ? 'bg-[#f04141] text-white shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Day {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {selectedDestModal.activities
                    .filter((act) => act.defaultDay === modalActiveDay)
                    .map((act) => (
                      <div
                        key={act.id}
                        className="bg-white p-3.5 rounded-lg border border-stone-200/80 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                              {act.recommendedTime}
                            </span>
                            <span className="font-bold text-stone-800">{act.name}</span>
                            <span className="text-stone-400">•</span>
                            <span className="text-stone-500">{act.category}</span>
                          </div>
                          <p className="text-stone-600 text-xs line-clamp-2">
                            {act.description}
                          </p>
                        </div>

                        <a
                          href={act.locationMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Map</span>
                        </a>
                      </div>
                    ))}
                </div>
              </div>

              {/* Embedded Google Map */}
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#f04141]" />
                  <span>Regional Map Overview</span>
                </h4>
                <div className="h-64 w-full rounded-xl overflow-hidden border border-stone-200">
                  <iframe
                    src={selectedDestModal.mapEmbedUrl}
                    title={`${selectedDestModal.name} Map`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Modal Action CTA */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedDestModal(null)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Close Guide
                </button>

                <button
                  onClick={() => handlePlanFromModal(selectedDestModal.id)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#f04141] hover:bg-[#d93030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Compass className="w-4 h-4" />
                  <span>Customize Itinerary For {selectedDestModal.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
