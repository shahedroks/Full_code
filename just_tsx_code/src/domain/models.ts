// Core Domain Models - Business entities independent of data source

export interface Town {
  id: string;
  name: string;
  state: string;
  enabled: boolean;
  zipCodes?: string[];
}

export interface ServiceSubSection {
  id: string;
  name: string;
  description?: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  subSections: ServiceSubSection[];
  addons: ServiceAddon[];
}

export interface CategoryTownAvailability {
  categoryId: string;
  townId: string;
  enabled: boolean;
}

export interface TimeSlot {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface DayOffException {
  date: string; // "2026-01-20"
  reason?: string;
}

export interface ProviderAvailability {
  providerId: string;
  weeklySchedule: TimeSlot[];
  dayOffExceptions: DayOffException[];
  enabled: boolean;
}

export type ProviderStatus = 'active' | 'busy' | 'offline';

export interface Provider {
  id: string;
  displayName: string;
  email: string;
  phone: string; // Should NEVER be exposed to customers
  avatar: string;
  rating: number;
  reviewCount: number;
  categoryIds: string[];
  townIds: string[];
  bio?: string;
  responseTime: string;
  status: ProviderStatus;
  enabled: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid_in_app' | 'paid_outside';

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  categoryId: string;
  subSectionId?: string;
  addonIds?: string[];
  townId: string;
  scheduledDate: string; // "2026-01-17"
  scheduledTime: string; // "14:00"
  address: string;
  notes?: string;
  photos?: string[];
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount?: number; // Deprecated: Use totalAmount instead
  totalAmount?: number; // Total amount customer pays
  providerAmount?: number; // Amount provider receives (90% of total)
  renizoFee?: number; // Renizo service fee (10% of total)
  createdAt: string;
  updatedAt: string;
  flaggedForContact?: boolean; // Flag if user attempts outside contact
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderType: 'customer' | 'provider';
  content: string;
  attachments?: string[];
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  bookingId: string;
  customerId: string;
  providerId: string;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export type NotificationType = 'booking' | 'message' | 'promotion' | 'reminder';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  bookingId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedAddresses: string[];
  preferredTownId?: string;
}

// Provider Pricing Models
export interface SubSectionPricing {
  subSectionId: string;
  price: number;
}

export interface AddonPricing {
  addonId: string;
  price: number;
}

export interface CategoryPricing {
  categoryId: string;
  subSectionPricing: SubSectionPricing[];
  addonPricing: AddonPricing[];
}

export interface ProviderPricing {
  providerId: string;
  categoryPricing: CategoryPricing[];
}

// View Models for UI
export interface ProviderListItem {
  id: string;
  displayName: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  distance: string;
  responseTime: string;
  availableToday: boolean;
  categoryNames: string[];
}

export interface BookingDetailsViewModel {
  booking: Booking;
  provider: ProviderListItem;
  category: ServiceCategory;
  town: Town;
  canChat: boolean;
  canPay: boolean;
  canCancel: boolean;
}