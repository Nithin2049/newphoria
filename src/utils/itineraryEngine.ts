import {
  ActivityItem,
  BudgetBreakdown,
  DaySchedule,
  GeneratedItinerary,
  TripPlanRequest,
} from '../types/travel';
import { DESTINATIONS_DATA } from '../data/destinations';

export function generatePersonalizedItinerary(request: TripPlanRequest): GeneratedItinerary {
  const destination = DESTINATIONS_DATA[request.destination];
  if (!destination) {
    throw new Error(`Destination ${request.destination} not found`);
  }

  const { days, budget, travelStyle, interests } = request;

  // Score each activity based on user preferences
  const scoredActivities = destination.activities.map((activity) => {
    let score = 0;

    // Match with user's selected interests
    activity.suitableInterests.forEach((interest) => {
      if (interests.includes(interest)) {
        score += 12;
      }
    });

    // Match with user's travel style
    if (activity.suitableStyles.includes(travelStyle) || travelStyle === 'Mixed') {
      score += 8;
    }

    // Travel style specific category bonuses
    if (travelStyle === 'Adventure' && (activity.category === 'Adventure' || activity.category === 'Beach')) {
      score += 6;
    } else if (travelStyle === 'Culture' && (activity.category === 'Heritage' || activity.category === 'Culture' || activity.category === 'Temples')) {
      score += 6;
    } else if (travelStyle === 'Nature' && activity.category === 'Nature') {
      score += 6;
    } else if (travelStyle === 'Relaxation' && (activity.category === 'Beach' || activity.category === 'Leisure' || activity.category === 'Dining')) {
      score += 6;
    }

    return { activity, score };
  });

  // Group activities by target day (1, 2, 3)
  const schedule: DaySchedule[] = [];
  const periods: ('morning' | 'midday' | 'afternoon' | 'evening' | 'night')[] = [
    'morning',
    'midday',
    'afternoon',
    'evening',
    'night',
  ];

  for (let dayNum = 1; dayNum <= days; dayNum++) {
    // Collect activities matching this day, ordered by priority score
    const dayPool = scoredActivities
      .filter((item) => item.activity.defaultDay === dayNum)
      .sort((a, b) => b.score - a.score);

    // Pick a cohesive set covering key periods: morning breakfast, morning sightseeing, midday, afternoon, dinner, night
    const selectedDayActivities: ActivityItem[] = [];

    // Ensure we have a breakfast or early spot
    const morningFood = dayPool.find(
      (i) => i.activity.period === 'morning' && i.activity.category === 'Dining'
    );
    if (morningFood) selectedDayActivities.push(morningFood.activity);

    // Morning attraction / exploration
    const morningSight = dayPool.find(
      (i) =>
        i.activity.period === 'morning' &&
        i.activity.category !== 'Dining' &&
        !selectedDayActivities.some((a) => a.id === i.activity.id)
    );
    if (morningSight) selectedDayActivities.push(morningSight.activity);

    // Midday activity / lunch / beach
    const middayAct = dayPool.find(
      (i) =>
        i.activity.period === 'midday' &&
        !selectedDayActivities.some((a) => a.id === i.activity.id)
    );
    if (middayAct) selectedDayActivities.push(middayAct.activity);

    // Afternoon culture / shopping / nature
    const afternoonAct = dayPool.find(
      (i) =>
        i.activity.period === 'afternoon' &&
        !selectedDayActivities.some((a) => a.id === i.activity.id)
    );
    if (afternoonAct) selectedDayActivities.push(afternoonAct.activity);

    // Evening dinner
    const eveningDining = dayPool.find(
      (i) =>
        (i.activity.period === 'evening' || i.activity.category === 'Dining') &&
        !selectedDayActivities.some((a) => a.id === i.activity.id)
    );
    if (eveningDining) selectedDayActivities.push(eveningDining.activity);

    // Night leisure / stroll / stargazing
    const nightAct = dayPool.find(
      (i) =>
        (i.activity.period === 'night' || i.activity.category === 'Leisure') &&
        !selectedDayActivities.some((a) => a.id === i.activity.id)
    );
    if (nightAct) selectedDayActivities.push(nightAct.activity);

    // Fallback if some periods weren't filled: pick highest remaining scored
    if (selectedDayActivities.length < 5) {
      dayPool.forEach((item) => {
        if (!selectedDayActivities.some((a) => a.id === item.activity.id) && selectedDayActivities.length < 6) {
          selectedDayActivities.push(item.activity);
        }
      });
    }

    // Sort chronologically according to recommendedTime
    selectedDayActivities.sort((a, b) => {
      const timeToMinutes = (t: string) => {
        const [time, modifier] = t.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
      };
      return timeToMinutes(a.recommendedTime) - timeToMinutes(b.recommendedTime);
    });

    const dayTitles: Record<number, string> = {
      1: `${destination.name} Orientation & Prime Highlights`,
      2: `Scenic Landscapes, Adventure & Hidden Gems`,
      3: `Cultural Immersion, Heritage & Coastal Serenity`,
    };

    const daySummaries: Record<number, string> = {
      1: `A curated introduction exploring ${destination.name}'s most celebrated sights, coastal flavours, and twilight panoramas.`,
      2: `Immerse in deeper natural wonders, local culinary secrets, and breathtaking outdoor activities tailored for your ${travelStyle.toLowerCase()} vibe.`,
      3: `Experience authentic local heritage, boutique markets, and peaceful retreats before concluding your journey.`,
    };

    const estimatedDayCost = selectedDayActivities.reduce((acc, act) => acc + (act.approxCost || 0), 0);

    schedule.push({
      dayNumber: dayNum,
      title: dayTitles[dayNum] || `Day ${dayNum} Itinerary`,
      summary: daySummaries[dayNum] || `Custom planned activities for Day ${dayNum}.`,
      activities: selectedDayActivities,
      estimatedDayCost,
    });
  }

  // Calculate detailed Budget Breakdown
  const totalActivitiesCost = schedule.reduce(
    (acc, day) => acc + day.activities.reduce((sum, act) => sum + (act.approxCost || 0), 0),
    0
  );

  // Determine budget tier based on user's daily budget allotment
  const dailyBudget = budget / days;
  let budgetTier: 'Budget' | 'Moderate' | 'Comfort' = 'Moderate';
  let dailyStayRate = destination.avgDailyStayCost;
  let dailyTransportRate = 600; // standard scooter/local cab
  let dailyFoodEstimate = 1000;

  if (dailyBudget < 3500) {
    budgetTier = 'Budget';
    dailyStayRate = Math.max(1000, destination.avgDailyStayCost * 0.65);
    dailyTransportRate = 450;
    dailyFoodEstimate = 750;
  } else if (dailyBudget > 8000) {
    budgetTier = 'Comfort';
    dailyStayRate = destination.avgDailyStayCost * 1.6;
    dailyTransportRate = 1200;
    dailyFoodEstimate = 1800;
  }

  const accommodationCost = Math.round(dailyStayRate * days);
  const transportationCost = Math.round(dailyTransportRate * days);
  const estimatedFoodCost = Math.round(dailyFoodEstimate * days);
  const miscellaneousCost = Math.round((accommodationCost + transportationCost + totalActivitiesCost) * 0.08);

  const totalEstimatedCost =
    accommodationCost + estimatedFoodCost + transportationCost + totalActivitiesCost + miscellaneousCost;

  const remainingBudget = budget - totalEstimatedCost;
  const isOverBudget = remainingBudget < 0;

  const budgetBreakdown: BudgetBreakdown = {
    accommodation: accommodationCost,
    food: estimatedFoodCost,
    transportation: transportationCost,
    activities: totalActivitiesCost,
    miscellaneous: miscellaneousCost,
    totalEstimatedCost,
    userBudget: budget,
    remainingBudget,
    isOverBudget,
    budgetTier,
  };

  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    destination: request.destination,
    destinationName: destination.name,
    destinationState: destination.state,
    days,
    budget,
    travelStyle,
    interests,
    schedule,
    budgetBreakdown,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
