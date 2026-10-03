export type DestinationId = 'goa' | 'gokarna' | 'ooty' | 'pondicherry';

export type TravelStyle = 'Adventure' | 'Relaxation' | 'Nature' | 'Culture' | 'Mixed';

export type Interest =
  | 'Beaches'
  | 'Nature'
  | 'Food'
  | 'History'
  | 'Temples'
  | 'Shopping'
  | 'Photography'
  | 'Adventure'
  | 'Culture'
  | 'Relaxation';

export interface SourceMeta {
  title: string;
  url: string;
  provider: string;
}

export interface ActivityItem {
  id: string;
  name: string;
  category: 'Dining' | 'Beach' | 'Heritage' | 'Nature' | 'Shopping' | 'Adventure' | 'Culture' | 'Leisure' | 'Temples';
  description: string;
  approxCost?: number | null; // in INR
  costDisplay?: string; // e.g. "Free", "₹50", "Price unavailable"
  recommendedDuration: string;
  suitableInterests: Interest[];
  suitableStyles: TravelStyle[];
  locationMapUrl: string;
  recommendedTime: string;
  defaultDay?: 1 | 2 | 3;
  period?: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  image?: string;
  tip?: string;
  sourceUrl?: string;
  source?: SourceMeta;
  verifiedStatus?: 'verified' | 'approximate' | 'unavailable';
}

export interface TransitInfo {
  nearestAirport?: string;
  flightsNote?: string;
  trainStation?: string;
  trainNote?: string;
  busNote?: string;
  rentalsNote?: string;
}

export interface DestinationInfo {
  id: DestinationId;
  name: string;
  state: string;
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  majorAttractions: string[];
  bestTimeToVisit: string;
  avgDailyStayCost: number; // base stay per night in INR
  transit: TransitInfo;
  mapEmbedUrl: string;
  activities: ActivityItem[];
}

export interface TripPlanRequest {
  destination: DestinationId;
  days: 1 | 2 | 3;
  budget: number;
  travelers?: number;
  travelStyle: TravelStyle;
  interests: Interest[];
  startDate?: string;
  preferredActivities?: string[];
  foodPreference?: string;
  accommodationPreference?: string;
}

export interface AccommodationOption {
  id: string;
  name: string;
  type: 'Resort' | 'Hotel' | 'Homestay' | 'Hostel' | 'Villa';
  location: string;
  pricePerNight?: number | null;
  priceDisplay: string; // e.g. "₹4,200 / night" or "Price unavailable — check current price"
  rating?: number | null;
  ratingDisplay?: string; // e.g. "4.4 / 5" or "Rating unavailable"
  reviewCount?: number;
  amenities: string[];
  distanceFromItinerary: string;
  bookingUrl: string;
  sourceUrl?: string;
  source?: SourceMeta;
  reasons: string[];
  verifiedStatus: 'verified' | 'approximate' | 'unavailable';
}

export interface MealRecommendation {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  time: string;
  restaurantName: string;
  cuisine: string;
  location: string;
  approxCostPerPerson?: number | null;
  priceDisplay: string; // e.g. "~ ₹450 / person" or "Price unavailable"
  openingHours?: string | null;
  rating?: number | null;
  mapUrl: string;
  websiteUrl?: string;
  specialty?: string;
  sourceUrl?: string;
  source?: SourceMeta;
  verifiedStatus: 'verified' | 'approximate' | 'unavailable';
}

export interface TransitSegment {
  from: string;
  to: string;
  approxDistance: string;
  estimatedTime: string;
  recommendedOption: string;
}

export interface WeatherInsight {
  temperature: number;
  condition: string;
  isFavorable: boolean;
  advice: string;
  rainRisk: string;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
  totalEstimatedCost: number;
  userBudget: number;
  remainingBudget: number;
  isOverBudget: boolean;
  budgetTier: 'Budget' | 'Moderate' | 'Comfort';
  hasUnpricedItems?: boolean;
  unpricedItemsNote?: string;
}

export interface DaySchedule {
  dayNumber: number;
  title: string;
  summary: string;
  activities: ActivityItem[];
  meals?: MealRecommendation[];
  transitInfo?: TransitSegment;
  estimatedDayCost: number;
}

export interface GeneratedItinerary {
  id: string;
  destination: DestinationId;
  destinationName: string;
  destinationState: string;
  days: 1 | 2 | 3;
  travelers?: number;
  budget: number;
  travelStyle: TravelStyle;
  interests: Interest[];
  startDate?: string;
  preferredActivities?: string[];
  foodPreference?: string;
  accommodationPreference?: string;
  schedule: DaySchedule[];
  accommodations?: AccommodationOption[];
  selectedAccommodationId?: string;
  weather?: WeatherInsight;
  routeOptimizationNote?: string;
  costPerPerson?: number;
  budgetBreakdown: BudgetBreakdown;
  createdAt: string;
  onlineGrounded?: boolean;
  onlineSources?: { title: string; url?: string }[];
  isOfflineFallback?: boolean;
  dataGroundingNote?: string;
}

export interface SavedTrip {
  id: string;
  itinerary: GeneratedItinerary;
  savedAt: string;
  userId?: string;
  firestoreId?: string;
}

export interface TravelMemory {
  id: string;
  travelerName: string;
  destination: string;
  date: string;
  caption: string;
  photoUrl: string;
  createdAt: string;
  userId?: string;
  storagePath?: string;
}

export interface ContactMessage {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  message: string;
  submittedAt: string;
  syncedToFirebase?: boolean;
}
