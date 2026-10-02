import React, { useState } from 'react';
import { GeneratedItinerary } from '../types/travel';
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
  ChevronRight,
  Info,
} from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: GeneratedItinerary;
  onSaveTrip: (itinerary: GeneratedItinerary) => void;
  isSaved: boolean;
  onScrollToPlanner?: () => void;
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  onSaveTrip,
  isSaved,
  onScrollToPlanner,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);

  const currentDaySchedule = itinerary.schedule.find((d) => d.dayNumber === activeDay) || itinerary.schedule[0];
  const { budgetBreakdown } = itinerary;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="itinerary-results" className="py-16 bg-stone-100/70 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Summary Card */}
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Layers className="w-80 h-80" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">
                <span>{itinerary.destinationState}</span>
                <span>•</span>
                <span>{itinerary.days} {itinerary.days === 1 ? 'Day Trip' : 'Days Trip'}</span>
                <span>•</span>
                <span>{itinerary.travelStyle} Style</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {itinerary.destinationName} Travel Itinerary
              </h2>
              <p className="mt-2 text-stone-300 text-sm max-w-xl">
                Personalized around your interests: {itinerary.interests.join(', ')}.
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

        {/* Day Selector Tabs */}
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
                  ({day.activities.length} stops)
                </span>
              </button>
            );
          })}
        </div>

        {/* Two Column Layout: Itinerary Schedule on Left, Budget Calculator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Day Activities Timeline */}
          <div className="lg:col-span-2 space-y-6">
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
              </div>

              {/* Activity Timeline List */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-stone-200/80 before:h-full">
                {currentDaySchedule.activities.map((act, index) => (
                  <div key={act.id || index} className="relative flex items-start gap-4 group">
                    {/* Time Dot Indicator */}
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
                        </div>

                        <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-stone-400" />
                          {act.approxCost === 0 ? 'Free' : `~ ${formatINR(act.approxCost)}`}
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
                          <span><strong>Tip:</strong> {act.tip}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                        <span className="text-xs text-stone-500">
                          Duration: {act.recommendedDuration}
                        </span>

                        {/* Prominent VIEW ON MAP Link */}
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
                  <span>Budget Calculator</span>
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {budgetBreakdown.budgetTier} Tier
                </span>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Accommodation ({itinerary.days} nights)</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.accommodation)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Food & Dining</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.food)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Local Transportation</span>
                  <span className="font-semibold text-stone-900">
                    {formatINR(budgetBreakdown.transportation)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Activities & Sightseeing</span>
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
                        {budgetBreakdown.isOverBudget ? 'Over Budget' : 'Remaining Savings'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {budgetBreakdown.isOverBudget
                          ? 'Estimated cost exceeds target'
                          : 'Comfortable safety margin'}
                      </div>
                    </div>
                  </div>

                  <span className="text-base font-extrabold font-mono">
                    {formatINR(Math.abs(budgetBreakdown.remainingBudget))}
                  </span>
                </div>
              </div>

              {/* Smart Budget Advice if Over Budget */}
              {budgetBreakdown.isOverBudget && (
                <div className="mt-4 p-3 bg-stone-100 rounded-lg text-xs text-stone-600 leading-relaxed">
                  <strong>Recommendation:</strong> Consider booking guesthouses/homestays instead of standard hotels, or opt for two-wheeler rentals to reduce local transit expenses.
                </div>
              )}

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
                  <span>{isSaved ? 'SAVED TO MY TRIPS' : 'SAVE TRIP'}</span>
                </button>

                {onScrollToPlanner && (
                  <button
                    onClick={onScrollToPlanner}
                    className="w-full py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Adjust Budget / Days
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
