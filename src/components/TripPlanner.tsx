import React, { useState } from 'react';
import {
  DestinationId,
  Interest,
  TravelStyle,
  TripPlanRequest,
} from '../types/travel';
import { DESTINATIONS_DATA } from '../data/destinations';
import {
  Compass,
  Calendar,
  Wallet,
  Check,
  AlertCircle,
  Sun,
  Camera,
  Coffee,
  Landmark,
  Shield,
  ShoppingBag,
  Footprints,
  Waves,
  Users,
  Loader2,
  Globe,
  Hotel,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';

interface TripPlannerProps {
  onGenerateItinerary: (request: TripPlanRequest) => void;
  isGenerating?: boolean;
  initialDestination?: DestinationId;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  onGenerateItinerary,
  isGenerating = false,
  initialDestination = 'goa',
}) => {
  const [destination, setDestination] = useState<DestinationId>(initialDestination);
  const [days, setDays] = useState<1 | 2 | 3>(3);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [travelers, setTravelers] = useState<number>(1);
  const [budgetInput, setBudgetInput] = useState<string>('12000');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Mixed');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([
    'Beaches',
    'Food',
    'History',
  ]);
  const [preferredActivities, setPreferredActivities] = useState<string[]>([
    'Heritage Walks',
    'Sunset Viewpoint',
  ]);
  const [foodPreference, setFoodPreference] = useState<string>('Local Coastal & Seafood');
  const [accommodationPreference, setAccommodationPreference] = useState<string>(
    'Boutique Resort'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const allInterests: { id: Interest; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'Beaches', label: 'Beaches', icon: Waves },
    { id: 'Nature', label: 'Nature', icon: Sun },
    { id: 'Food', label: 'Food & Cafes', icon: Coffee },
    { id: 'History', label: 'History & Heritage', icon: Landmark },
    { id: 'Temples', label: 'Temples & Spiritual', icon: Shield },
    { id: 'Shopping', label: 'Shopping & Bazaars', icon: ShoppingBag },
    { id: 'Photography', label: 'Photography', icon: Camera },
    { id: 'Adventure', label: 'Adventure & Treks', icon: Footprints },
  ];

  const travelStyles: { id: TravelStyle; label: string; desc: string }[] = [
    { id: 'Adventure', label: 'Adventure', desc: 'Active, treks, sports & thrills' },
    { id: 'Relaxation', label: 'Relaxation', desc: 'Calm, scenic beaches & leisure' },
    { id: 'Nature', label: 'Nature', desc: 'Waterfalls, forests & scenic vistas' },
    { id: 'Culture', label: 'Culture', desc: 'Heritage, temples & local life' },
    { id: 'Mixed', label: 'Mixed', desc: 'Balanced highlights across all facets' },
  ];

  const activityOptions = [
    'Watersports & Kayaking',
    'Heritage Walks & Forts',
    'Sunset Viewpoint',
    'Local Night Markets',
    'Cafe Hopping',
    'Hill Treks & Trails',
    'Boat Cruise',
    'Ayurvedic Wellness & Spa',
  ];

  const foodOptions = [
    'Local Coastal & Seafood',
    'Pure Vegetarian & Jain',
    'Traditional Regional Thali',
    'Cafes & Continental / Italian',
    'Street Food & Night Stalls',
  ];

  const accommodationOptions = [
    'Boutique Resort',
    'Budget Homestay & Guesthouse',
    'Heritage Villa & Colonial Manor',
    'Backpacker Hostel',
    'Premium 4/5-Star Hotel',
  ];

  const toggleInterest = (interest: Interest) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleActivity = (activity: string) => {
    if (preferredActivities.includes(activity)) {
      setPreferredActivities(preferredActivities.filter((a) => a !== activity));
    } else {
      setPreferredActivities([...preferredActivities, activity]);
    }
  };

  const handleBudgetChange = (val: string) => {
    const clean = val.replace(/\D/g, '');
    setBudgetInput(clean);
  };

  const setBudgetPreset = (amount: number) => {
    setBudgetInput(amount.toString());
  };

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const numericBudget = parseInt(budgetInput, 10);

    if (isNaN(numericBudget) || numericBudget < 1500) {
      setValidationError('Please enter a valid trip budget of at least ₹1,500 to cover accommodation and activities.');
      return;
    }

    if (selectedInterests.length === 0) {
      setValidationError('Please select at least one travel interest to personalize your stops.');
      return;
    }

    onGenerateItinerary({
      destination,
      days,
      startDate,
      budget: numericBudget,
      travelers,
      travelStyle,
      interests: selectedInterests,
      preferredActivities,
      foodPreference,
      accommodationPreference,
    });
  };

  const numBudget = parseInt(budgetInput, 10) || 0;
  const budgetPerPerson = travelers > 0 ? Math.round(numBudget / travelers) : numBudget;

  return (
    <section id="plan-trip" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#f04141] text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Live Online Travel Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Plan Your Personalized Trip
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Tell us your travel dates, group size, budget, dining tastes, and preferred stay. NEWPHORIA cross-references live online travel data, weather forecasts, and verified attractions to build your optimized day-by-day itinerary.
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleGenerateClick}
          className="bg-stone-50 rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-10"
        >
          {/* 1. Destination Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-mono">
                  1
                </span>
                Choose Destination
              </label>
              <span className="text-xs text-stone-500">4 Supported Destinations</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {(Object.keys(DESTINATIONS_DATA) as DestinationId[]).map((destKey) => {
                const dest = DESTINATIONS_DATA[destKey];
                const isSelected = destination === destKey;
                return (
                  <button
                    type="button"
                    key={dest.id}
                    onClick={() => setDestination(dest.id)}
                    className={`relative rounded-xl overflow-hidden text-left border-2 transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? 'border-[#f04141] ring-2 ring-red-500/20 shadow-md'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="h-28 sm:h-32 w-full relative overflow-hidden bg-stone-200">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#f04141] text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <div className="font-bold text-base sm:text-lg leading-tight">
                          {dest.name}
                        </div>
                        <div className="text-[11px] text-stone-200 truncate">
                          {dest.state}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Dates, Duration, Travelers & Budget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-stone-200">
            {/* Travel Date */}
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                  2
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  Travel Date
                </span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 font-semibold text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Synchronizes with live weather forecast
              </span>
            </div>

            {/* Number of Days */}
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                  3
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  Duration
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => {
                  const isSelected = days === num;
                  return (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setDays(num as 1 | 2 | 3)}
                      className={`py-2 px-1.5 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#f04141] text-white border-[#f04141] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-sm font-bold">{num} {num === 1 ? 'Day' : 'Days'}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-red-100' : 'text-stone-500'}`}>
                        {num === 1 ? 'Quick' : num === 2 ? 'Weekend' : 'Complete'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Number of Travelers */}
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                  4
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-stone-500" />
                  Travelers
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { count: 1, label: 'Solo' },
                  { count: 2, label: 'Duo' },
                  { count: 4, label: 'Group' },
                  { count: 6, label: 'Family' },
                ].map((item) => {
                  const isSelected = travelers === item.count;
                  return (
                    <button
                      type="button"
                      key={item.count}
                      onClick={() => setTravelers(item.count)}
                      className={`py-2 px-1 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#f04141] text-white border-[#f04141] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-sm font-bold">{item.count}</div>
                      <div className={`text-[9px] ${isSelected ? 'text-red-100' : 'text-stone-500'}`}>
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Budget in INR */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                    5
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-stone-500" />
                    Total Budget
                  </span>
                </label>
                <span className="text-[11px] text-stone-500">₹ INR</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={budgetInput}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="e.g. 12000"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900 font-bold text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-stone-500">~₹{budgetPerPerson.toLocaleString('en-IN')}/person</span>
                <div className="flex gap-1">
                  {[6000, 12000, 24000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudgetPreset(preset)}
                      className="px-1.5 py-0.2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded text-[10px]"
                    >
                      ₹{preset / 1000}k
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Travel Style */}
          <div className="pt-4 border-t border-stone-200">
            <label className="text-base font-bold text-stone-900 flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-mono">
                6
              </span>
              Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {travelStyles.map((style) => {
                const isSelected = travelStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setTravelStyle(style.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center justify-between">
                      {style.label}
                      {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                    <div
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        isSelected ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {style.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Interests (Multi-select) */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-mono">
                  7
                </span>
                Core Interests
              </label>
              <span className="text-xs text-stone-500">
                {selectedInterests.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {allInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                const Icon = interest.icon;
                return (
                  <button
                    type="button"
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        isSelected ? 'bg-[#f04141] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="truncate">{interest.label}</span>
                    {isSelected && <Check className="w-3 h-3 ml-auto text-[#f04141]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Preferences: Preferred Activities, Food & Accommodation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-200">
            {/* Preferred Activities */}
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                  8
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-stone-500" />
                  Preferred Activities
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activityOptions.map((act) => {
                  const isSelected = preferredActivities.includes(act);
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => toggleActivity(act)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {act}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food Preferences */}
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                  9
                </span>
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-stone-500" />
                  Food Preference
                </span>
              </label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                {foodOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1.5">
                Matches authentic local breakfast, lunch, and dinner spots.
              </p>
            </div>

            {/* Accommodation Preference */}
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                  10
                </span>
                <span className="flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-stone-500" />
                  Accommodation Style
                </span>
              </label>
              <select
                value={accommodationPreference}
                onChange={(e) => setAccommodationPreference(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                {accommodationOptions.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1.5">
                Generates multiple options with live pricing and reasons.
              </p>
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col items-center justify-center gap-3">
            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full sm:w-auto min-w-[320px] px-8 py-4 bg-[#f04141] hover:bg-[#d93030] text-white font-bold text-base uppercase tracking-wider rounded-xl shadow-lg hover:shadow-red-600/30 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer ${
                isGenerating ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ANALYZING LIVE TRAVEL DATA...</span>
                </>
              ) : (
                <>
                  <Compass className="w-5 h-5" />
                  <span>GENERATE LIVE ITINERARY</span>
                </>
              )}
            </button>

            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-stone-500 animate-pulse">
                <Globe className="w-4 h-4 text-[#f04141]" />
                <span>Retrieving current attractions, real accommodations, dining, weather & route times...</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
