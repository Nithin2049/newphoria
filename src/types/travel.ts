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

export interface ActivityItem {
  id: string;
  name: string;
  category: 'Dining' | 'Beach' | 'Heritage' | 'Nature' | 'Shopping' | 'Adventure' | 'Culture' | 'Leisure' | 'Temples';
  description: string;
  approxCost: number; // in INR
  recommendedDuration: string;
  suitableInterests: Interest[];
  suitableStyles: TravelStyle[];
  locationMapUrl: string;
  recommendedTime: string;
  defaultDay: 1 | 2 | 3;
  period: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  image?: string;
  tip?: string;
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
  travelStyle: TravelStyle;
  interests: Interest[];
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
}

export interface DaySchedule {
  dayNumber: number;
  title: string;
  summary: string;
  activities: ActivityItem[];
  estimatedDayCost: number;
}

export interface GeneratedItinerary {
  id: string;
  destination: DestinationId;
  destinationName: string;
  destinationState: string;
  days: 1 | 2 | 3;
  budget: number;
  travelStyle: TravelStyle;
  interests: Interest[];
  schedule: DaySchedule[];
  budgetBreakdown: BudgetBreakdown;
  createdAt: string;
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
