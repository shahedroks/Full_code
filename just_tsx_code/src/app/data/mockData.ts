// Mock data for the home services marketplace

export interface Town {
  id: string;
  name: string;
  state: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  townIds: string[];
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  categoryId: string;
  townIds: string[];
  priceRange: string;
  availability: 'available' | 'busy' | 'unavailable';
  distance: string;
  responseTime: string;
}

export interface Booking {
  id: string;
  providerId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paidInApp: boolean;
  categoryId: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  containsPhoneNumber?: boolean;
}

export const TOWNS: Town[] = [
  { id: '1', name: 'Terrace', state: 'BC' },
  { id: '2', name: 'Kitimat', state: 'BC' },
  { id: '3', name: 'Prince Rupert', state: 'BC' },
  { id: '4', name: 'Smithers', state: 'BC' },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'residential-cleaning', name: 'Residential Cleaning', icon: 'Home', townIds: ['1', '2', '3', '4'] },
  { id: 'commercial-cleaning', name: 'Commercial Cleaning', icon: 'Building', townIds: ['1', '2', '3', '4'] },
  { id: 'contract-cleaning', name: 'Contract Cleaning', icon: 'FileText', townIds: ['1', '2', '3'] },
  { id: 'floor-waxing', name: 'Floor Waxing', icon: 'Sparkles', townIds: ['1', '2', '4'] },
  { id: 'pressure-washing', name: 'Pressure Washing', icon: 'Droplets', townIds: ['2', '3', '4'] },
  { id: 'grass-cutting', name: 'Grass Cutting', icon: 'Trees', townIds: ['1', '3', '4'] },
  { id: 'snow-removal', name: 'Snow Removal', icon: 'Snowflake', townIds: ['1', '2', '3'] },
  { id: 'laundry', name: 'Laundry', icon: 'Shirt', townIds: ['1', '2', '4'] },
];

export const PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Sparkle Clean Services',
    avatar: '',
    rating: 5.0,
    reviewCount: 314,
    categoryId: 'residential-cleaning',
    townIds: ['1', '2', '4'],
    priceRange: '$',
    availability: 'available',
    distance: '4.1 mi',
    responseTime: 'Usually responds in 1 hour',
  },
  {
    id: '2',
    name: 'Pro Office Cleaners',
    avatar: '',
    rating: 4.8,
    reviewCount: 127,
    categoryId: 'commercial-cleaning',
    townIds: ['1', '2', '3'],
    priceRange: '$$',
    availability: 'available',
    distance: '2.3 mi',
    responseTime: 'Usually responds in 1 hour',
  },
  {
    id: '3',
    name: 'Premium Pressure Wash',
    avatar: '',
    rating: 4.9,
    reviewCount: 203,
    categoryId: 'pressure-washing',
    townIds: ['2', '3', '4'],
    priceRange: '$$$',
    availability: 'busy',
    distance: '3.7 mi',
    responseTime: 'Usually responds in 2 hours',
  },
  {
    id: '4',
    name: 'Green Lawn Care',
    avatar: '',
    rating: 4.7,
    reviewCount: 89,
    categoryId: 'grass-cutting',
    townIds: ['1', '3', '4'],
    priceRange: '$$',
    availability: 'available',
    distance: '1.2 mi',
    responseTime: 'Usually responds in 30 minutes',
  },
  {
    id: '5',
    name: 'Quick Laundry Pro',
    avatar: '',
    rating: 4.6,
    reviewCount: 156,
    categoryId: 'laundry',
    townIds: ['1', '2', '4'],
    priceRange: '$',
    availability: 'busy',
    distance: '5.8 mi',
    responseTime: 'Usually responds in 3 hours',
  },
];

export const detectPhoneNumber = (text: string): boolean => {
  const phoneRegex = /(\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})|(\d{10})|(\d{3}[-.\s]\d{3}[-.\s]\d{4})/g;
  return phoneRegex.test(text);
};