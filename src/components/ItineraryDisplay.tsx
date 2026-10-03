import React, { useState } from 'react';
import {
  AccommodationOption,
  ActivityItem,
  GeneratedItinerary,
  MealRecommendation,
} from '../types/travel';
import { formatINR } from '../utils/itineraryEngine';
import {
  MapPin,
  ExternalLink,
  Clock,
  Coins,
  Bookmark,
  Check,
  AlertTriangle,
  Printer,
  Calendar,
  Layers,
  Info,
  Globe,
  CloudSun,
  RefreshCw,
  UtensilsCrossed,
  Hotel,
  Car,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: GeneratedItinerary;
  onSaveTrip: (itinerary: GeneratedItinerary) => void;
  isSaved: boolean;
  onScrollToPlanner?: () => void;
  onUpdateItinerary?: (updated: GeneratedItinerary) => void;
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  onSaveTrip,
  isSaved,
  onScrollToPlanner,
  onUpdateItinerary,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [modifyingAction, setModifyingAction] = useState<string | null>(null);

  const currentDaySchedule =
    itinerary.schedule.find((d) => d.dayNumber === activeDay) || itinerary.schedule[0];
  const { budgetBreakdown, accommodations = [], selectedAccommodationId } = itinerary;

  const activeAccommodation =
    accommodations.find((a) => a.id === selectedAccommodationId) || accommodations[0];

  const handlePrint = () => {
    window.print();
  };

  // Perform targeted modification on the server without regenerating the entire itinerary
  const handleModify = async (params: {
    action: 'select_hotel' | 'change_hotel' | 'change_restaurant' | 'change_activity' | 'apply_modifier';
    targetId?: string;
    dayNumber?: number;
    modifierType?: string;
  }) => {
    const actionKey = `${params.action}-${params.targetId || params.modifierType || ''}`;
    setModifyingAction(actionKey);

    try {
      const res = await fetch('/api/itinerary/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary,
          ...params,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.itinerary && onUpdateItinerary) {
          onUpdateItinerary(data.itinerary);
        }
      }
    } catch (err) {
      console.error('Targeted modification error:', err);
    } finally {
      setModifyingAction(null);
    }
  };

  return (
    <section id="itinerary-results" className="py-16 bg-stone-100/70 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Offline Fallback Banner if live data failed */}
        {itinerary.isOfflineFallback && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Live travel data is currently unavailable. Showing an offline itinerary.</div>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                External travel listings could not be queried in real time. This itinerary was synthesized using local baseline knowledge. Please verify all operating hours, addresses, tariffs, and room availability before booking.
              </p>
            </div>
          </div>
        )}

        {/* 1. Header Summary Card */}
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Layers className="w-80 h-80" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">
                <span>{itinerary.destinationState}</span>
                <span>•</span>
                <span>{itinerary.days} {itinerary.days === 1 ? 'Day Trip' : 'Days Trip'}</span>
                {itinerary.travelers && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {itinerary.travelers} {itinerary.travelers === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{itinerary.travelStyle} Style</span>
                {itinerary.onlineGrounded ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Globe className="w-3 h-3" /> Live Data Grounded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <AlertTriangle className="w-3 h-3" /> Offline Baseline
                  </span>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {itinerary.destinationName} Travel Itinerary
              </h2>
              <p className="mt-2 text-stone-300 text-sm max-w-xl">
                Personalized around your interests ({itinerary.interests.join(', ')}) & {itinerary.foodPreference || 'local gastronomy'}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSaveTrip(itinerary)}
                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  isSaved
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-[#f04141] text-white hover:bg-[#d93030]'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>SAVED TO MY TRIPS</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>SAVE THIS TRIP</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
                title="Print Itinerary"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Weather Insight & Route Optimization Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Live Weather Forecast Card */}
          {itinerary.weather && (
            <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <CloudSun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                    Live Forecast (Open-Meteo API)
                  </span>
                  <span className="text-sm font-black text-stone-900">
                    {itinerary.weather.temperature}°C • {itinerary.weather.condition}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  <strong>Advisory:</strong> {itinerary.weather.advice}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-stone-500">
                  <span>Precipitation Risk: {itinerary.weather.rainRisk}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">Outdoor times optimized</span>
                </div>
              </div>
            </div>
          )}

          {/* Route Optimization Card */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#f04141] flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-700 tracking-wider">
                  Route Optimization
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Zero Backtracking
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {itinerary.routeOptimizationNote ||
                  'Attractions and dining stops are sequentially clustered to minimize transit hours and save travel costs.'}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-stone-500">
                <span>Optimal Transit: Two-Wheeler / Cab / Auto</span>
                <span>•</span>
                <span>Clustered geographically</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Alternatives & Tone Modifiers Bar */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Sparkles className="w-4 h-4 text-[#f04141]" />
              <span>Modify Trip in One Click (Without Regenerating All):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  handleModify({ action: 'apply_modifier', modifierType: 'cheaper' })
                }
                disabled={Boolean(modifyingAction)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {modifyingAction === 'apply_modifier-cheaper' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-[#f04141]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-emerald-600" />
                )}
                <span>Make this cheaper</span>
              </button>

              <button
                onClick={() =>
                  handleModify({ action: 'apply_modifier', modifierType: 'adventurous' })
                }
                disabled={Boolean(modifyingAction)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {modifyingAction === 'apply_modifier-adventurous' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-[#f04141]" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-500" />
                )}
                <span>Make more adventurous</span>
              </button>

              <button
                onClick={() =>
                  handleModify({ action: 'apply_modifier', modifierType: 'more_food' })
                }
                disabled={Boolean(modifyingAction)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {modifyingAction === 'apply_modifier-more_food' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-[#f04141]" />
                ) : (
                  <UtensilsCrossed className="w-3 h-3 text-orange-500" />
                )}
                <span>Add more food spots</span>
              </button>

              <button
                onClick={() =>
                  handleModify({ action: 'apply_modifier', modifierType: 'less_travel' })
                }
                disabled={Boolean(modifyingAction)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {modifyingAction === 'apply_modifier-less_travel' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-[#f04141]" />
                ) : (
                  <Car className="w-3 h-3 text-blue-500" />
                )}
                <span>Reduce travel time</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Curated Accommodation Options Section */}
        {accommodations.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-sm mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-[#f04141]" />
                  <h3 className="text-xl font-bold text-stone-900">
                    Source-Grounded Accommodations
                  </h3>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Retrieved from destination archives matching your preference ({itinerary.accommodationPreference || 'Comfort Stay'}). Real source links provided.
                </p>
              </div>

              <button
                onClick={() => handleModify({ action: 'change_hotel' })}
                disabled={Boolean(modifyingAction)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-800 flex items-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {modifyingAction === 'change_hotel-' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#f04141]" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                )}
                <span>Request Alternative Stays</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accommodations.map((acc) => {
                const isSelected = (selectedAccommodationId || accommodations[0]?.id) === acc.id;
                return (
                  <div
                    key={acc.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-[#f04141] bg-red-50/20 ring-2 ring-red-500/20 shadow-sm'
                        : 'border-stone-200 bg-stone-50/60 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-700">
                          {acc.type}
                        </span>

                        {acc.rating ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                            <span>{acc.rating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-400">
                            Rating not published
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-stone-900 leading-snug">
                        {acc.name}
                      </h4>
                      <div className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{acc.location}</span>
                      </div>

                      {/* Pricing with strict data-grounding */}
                      <div className="text-xs font-bold text-stone-900 mt-2">
                        {acc.pricePerNight ? (
                          <>
                            {formatINR(acc.pricePerNight)}{' '}
                            <span className="text-[11px] font-normal text-stone-500">/ night</span>
                          </>
                        ) : (
                          <span className="text-stone-600 font-medium italic text-[11px]">
                            {acc.priceDisplay || 'Price unavailable — check current price'}
                          </span>
                        )}
                      </div>

                      {/* Source tag & verification status */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          {acc.verifiedStatus === 'verified' ? 'Verified Source' : 'Estimated Option'}
                        </span>

                        {acc.source && (
                          <a
                            href={acc.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                          >
                            <span>{acc.source.provider}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {acc.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-white text-stone-600 border border-stone-200 text-[10px]"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Reasons why it fits */}
                      <div className="mt-3 pt-2.5 border-t border-stone-200/80">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                          Fit Rationale:
                        </span>
                        <ul className="space-y-1 text-xs text-stone-600">
                          {acc.reasons.map((r, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                      <a
                        href={acc.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Map & Info</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          handleModify({ action: 'select_hotel', targetId: acc.id })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        {isSelected ? 'Selected Stay' : 'Select Stay'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Day Selector Tabs */}
        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {itinerary.schedule.map((day) => {
            const isActive = activeDay === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#f04141] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>DAY {day.dayNumber}</span>
                <span className={`text-xs ml-1 ${isActive ? 'text-red-100' : 'text-stone-400'}`}>
                  ({day.activities.length} stops + {(day.meals || []).length} meals)
                </span>
              </button>
            );
          })}
        </div>

        {/* 6. Two Column Layout: Itinerary Schedule & Meals on Left, Budget Calculator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Day Activities & Meals */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-sm">
              <div className="border-b border-stone-200 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f04141]">
                    Day {currentDaySchedule.dayNumber} Overview
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Est. Day Activities Cost: {formatINR(currentDaySchedule.estimatedDayCost)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mt-1">
                  {currentDaySchedule.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  {currentDaySchedule.summary}
                </p>

                {currentDaySchedule.transitInfo && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium">
                    <Car className="w-3.5 h-3.5 text-stone-500" />
                    <span>Transit: {currentDaySchedule.transitInfo.approxDistance} (~{currentDaySchedule.transitInfo.estimatedTime}) via {currentDaySchedule.transitInfo.recommendedOption}</span>
                  </div>
                )}
              </div>

              {/* Curated Meals for this Day (Breakfast, Lunch, Dinner) */}
              {currentDaySchedule.meals && currentDaySchedule.meals.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-[#f04141]" />
                      Source-Grounded Dining for Day {currentDaySchedule.dayNumber}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Matches {itinerary.foodPreference || 'Local Tastes'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentDaySchedule.meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                              {meal.mealType}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500">
                              {meal.time}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-stone-900 leading-snug">
                            {meal.restaurantName}
                          </h5>
                          <div className="text-[11px] text-stone-500 truncate mt-0.5">
                            {meal.cuisine} • {meal.location}
                          </div>

                          {meal.specialty && (
                            <div className="text-[11px] text-stone-600 mt-1.5 italic">
                              "{meal.specialty}"
                            </div>
                          )}

                          <div className="text-xs font-semibold text-stone-700 mt-2">
                            {meal.approxCostPerPerson ? (
                              `~ ${formatINR(meal.approxCostPerPerson)} / person`
                            ) : (
                              <span className="text-stone-500 font-normal italic text-[11px]">
                                {meal.priceDisplay || 'Price unavailable — check menu'}
                              </span>
                            )}
                          </div>

                          {/* Source Attribution Link */}
                          <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-stone-500">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              {meal.verifiedStatus === 'verified' ? 'Verified Source' : 'Estimated Spot'}
                            </span>
                            {meal.source && (
                              <a
                                href={meal.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                              >
                                <span>{meal.source.provider}</span>
                                <ExternalLink className="w-2 h-2" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 mt-2 border-t border-stone-200/80 flex items-center justify-between">
                          <a
                            href={meal.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Map</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              handleModify({
                                action: 'change_restaurant',
                                targetId: meal.id,
                                dayNumber: currentDaySchedule.dayNumber,
                              })
                            }
                            disabled={Boolean(modifyingAction)}
                            className="text-[10px] font-semibold text-stone-600 hover:text-stone-900 px-2 py-1 rounded bg-white border border-stone-200 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {modifyingAction === `change_restaurant-${meal.id}` ? (
                              <RefreshCw className="w-2.5 h-2.5 animate-spin text-[#f04141]" />
                            ) : (
                              <RefreshCw className="w-2.5 h-2.5" />
                            )}
                            <span>Change</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Timeline List */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-stone-200/80 before:h-full">
                {currentDaySchedule.activities.map((act, index) => (
                  <div key={act.id || index} className="relative flex items-start gap-4 group">
                    {/* Number Dot Indicator */}
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#f04141] text-[#f04141] flex items-center justify-center shrink-0 z-10 shadow-xs font-bold text-xs mt-0.5">
                      {index + 1}
                    </div>

                    {/* Activity Card Body */}
                    <div className="flex-1 bg-stone-50/80 hover:bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-200 text-stone-800 text-xs font-bold font-mono">
                            <Clock className="w-3 h-3 text-stone-500" />
                            {act.recommendedTime}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100/70 text-red-800">
                            {act.category}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            {act.verifiedStatus === 'verified' ? 'Verified Source Spot' : 'Estimated Activity'}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-stone-400" />
                          {act.costDisplay ||
                            (act.approxCost === 0
                              ? 'Free Entry'
                              : act.approxCost
                              ? `~ ${formatINR(act.approxCost)}`
                              : 'Entry price unavailable')}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                        {act.name}
                      </h4>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                        {act.description}
                      </p>

                      {act.tip && (
                        <div className="mb-3 text-xs bg-amber-50 text-amber-900 p-2 rounded border border-amber-200/80 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                          <span><strong>Travel Tip:</strong> {act.tip}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-500">
                            Duration: {act.recommendedDuration}
                          </span>
                          {act.source && (
                            <a
                              href={act.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                            >
                              <span>Source: {act.source.provider}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleModify({
                                action: 'change_activity',
                                targetId: act.id,
                                dayNumber: currentDaySchedule.dayNumber,
                              })
                            }
                            disabled={Boolean(modifyingAction)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {modifyingAction === `change_activity-${act.id}` ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-[#f04141]" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            <span>Change Stop</span>
                          </button>

                          <a
                            href={act.locationMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg text-xs font-bold tracking-wide transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>[ VIEW ON MAP ]</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Budget Calculator */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-5">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#f04141]" />
                  <span>Budget System</span>
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {budgetBreakdown.budgetTier} Tier
                </span>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">
                    Stay ({activeAccommodation?.name ? `${activeAccommodation.name.slice(0, 16)}...` : `${itinerary.days} nights`})
                  </span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.accommodation)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Food & Dining ({itinerary.days * 3} meals)</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.food)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Local Transit</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.transportation)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Activities & Tickets</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.activities)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Miscellaneous & Buffer</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.miscellaneous)}
                  </span>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="mt-6 pt-4 border-t-2 border-stone-900 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600 font-medium">Your Input Budget:</span>
                  <span className="font-bold text-stone-900">
                    {formatINR(budgetBreakdown.userBudget)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600 font-medium">Total Estimated Cost:</span>
                  <span className="font-bold text-stone-900">
                    {formatINR(budgetBreakdown.totalEstimatedCost)}
                  </span>
                </div>

                {itinerary.costPerPerson && (
                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                    <span>Estimated Cost / Person:</span>
                    <span className="font-semibold text-stone-800">
                      {formatINR(itinerary.costPerPerson)}
                    </span>
                  </div>
                )}

                {/* Transparency notice for unpriced listings */}
                {budgetBreakdown.hasUnpricedItems && (
                  <div className="mt-3 p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                    <strong>Note on Costs:</strong> {budgetBreakdown.unpricedItemsNote || 'Some retrieved listings do not publish fixed tariffs; verify current prices directly.'}
                  </div>
                )}

                {/* Remaining / Over Budget Banner */}
                <div
                  className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between ${
                    budgetBreakdown.isOverBudget
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {budgetBreakdown.isOverBudget ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-xs sm:text-sm">
                        {budgetBreakdown.isOverBudget ? 'Budget Exceeded' : 'Remaining Savings'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {budgetBreakdown.isOverBudget
                          ? 'Requested budget is tight for selected style'
                          : 'Comfortable safety margin'}
                      </div>
                    </div>
                  </div>

                  <span className="text-base font-extrabold font-mono">
                    {formatINR(Math.abs(budgetBreakdown.remainingBudget))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={() => onSaveTrip(itinerary)}
                  className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#f04141] hover:bg-[#d93030] text-white shadow-md'
                  }`}
                >
                  {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-4 h-4" />}
                  <span>{isSaved ? 'SAVED TO MY TRIPS' : 'SAVE TRIP TO FIRESTORE'}</span>
                </button>

                {onScrollToPlanner && (
                  <button
                    onClick={onScrollToPlanner}
                    className="w-full py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Adjust Travel Dates & Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
