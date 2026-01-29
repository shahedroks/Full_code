import { MockDataRepository } from '@/data/MockDataRepository';
import {
  ProviderFilterService,
  PhoneNumberDetectionService,
  DateTimeService,
} from '@/services/BusinessLogicServices';
import type {
  Town,
  ServiceCategory,
  Provider,
  Booking,
  ChatThread,
  ChatMessage,
  Notification,
  ProviderListItem,
  BookingDetailsViewModel,
  ProviderPricing,
} from '@/domain/models';

/**
 * Application Service Layer
 * Orchestrates business logic and data access
 * This is what UI components should interact with
 */
export class AppService {
  private static instance: AppService;
  
  private repository: MockDataRepository;
  private filterService: ProviderFilterService;
  private phoneService: PhoneNumberDetectionService;
  private dateTimeService: DateTimeService;

  private constructor() {
    this.repository = MockDataRepository.getInstance();
    this.filterService = new ProviderFilterService();
    this.phoneService = new PhoneNumberDetectionService();
    this.dateTimeService = new DateTimeService();
  }

  public static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  // Town Services
  async getTowns(): Promise<Town[]> {
    return this.repository.getTowns();
  }

  async getTownById(id: string): Promise<Town | null> {
    return this.repository.getTownById(id);
  }

  // Category Services
  async getCategoriesForTown(townId: string): Promise<ServiceCategory[]> {
    return this.repository.getCategoriesForTown(townId);
  }

  async getCategories(): Promise<ServiceCategory[]> {
    return this.repository.getCategories();
  }

  // Provider Services
  async getProvidersForTown(townId: string): Promise<Provider[]> {
    return this.repository.getProvidersForTown(townId);
  }

  async getProvidersForCategory(
    categoryId: string,
    townId: string
  ): Promise<ProviderListItem[]> {
    const providers = await this.repository.getProvidersForCategory(categoryId, townId);
    const categories = await this.repository.getCategories();
    
    return Promise.all(
      providers.map(async (provider) => {
        const availability = await this.repository.getProviderAvailability(provider.id);
        const availableToday = availability 
          ? this.filterService.isAvailableToday(availability)
          : false;

        const categoryNames = provider.categoryIds
          .map(id => categories.find(c => c.id === id)?.name)
          .filter(Boolean) as string[];

        return {
          id: provider.id,
          displayName: provider.displayName,
          avatar: provider.avatar,
          rating: provider.rating,
          reviewCount: provider.reviewCount,
          distance: this.calculateMockDistance(),
          responseTime: provider.responseTime,
          availableToday,
          categoryNames,
        };
      })
    );
  }

  async getAvailableProvidersForBooking(
    categoryId: string,
    townId: string,
    date: string,
    time: string
  ): Promise<ProviderListItem[]> {
    const providers = await this.repository.getProvidersForCategory(categoryId, townId);
    const availabilities = await Promise.all(
      providers.map(p => this.repository.getProviderAvailability(p.id))
    );

    const filtered = this.filterService.filterAvailableProviders(
      providers,
      availabilities.filter(Boolean) as any[],
      { townId, categoryId, date, time }
    );

    const categories = await this.repository.getCategories();
    
    return filtered.map(provider => {
      const categoryNames = provider.categoryIds
        .map(id => categories.find(c => c.id === id)?.name)
        .filter(Boolean) as string[];

      return {
        id: provider.id,
        displayName: provider.displayName,
        avatar: provider.avatar,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        distance: this.calculateMockDistance(),
        responseTime: provider.responseTime,
        availableToday: true,
        categoryNames,
      };
    });
  }

  async getProviderById(id: string): Promise<Provider | null> {
    return this.repository.getProviderById(id);
  }

  async updateProviderServices(providerId: string, categoryIds: string[], townIds: string[]): Promise<Provider> {
    return this.repository.updateProviderServices(providerId, categoryIds, townIds);
  }

  async updateProviderStatus(providerId: string, status: 'active' | 'busy' | 'offline'): Promise<Provider> {
    return this.repository.updateProviderStatus(providerId, status);
  }

  // Provider Pricing Services
  async getProviderPricing(providerId: string): Promise<ProviderPricing | null> {
    return this.repository.getProviderPricing(providerId);
  }

  async saveProviderPricing(pricing: ProviderPricing): Promise<ProviderPricing> {
    return this.repository.saveProviderPricing(pricing);
  }

  async getTopRatedProviders(townId: string, limit: number = 3): Promise<ProviderListItem[]> {
    const providers = await this.repository.getProvidersForTown(townId);
    const sorted = providers.sort((a, b) => b.rating - a.rating).slice(0, limit);
    const categories = await this.repository.getCategories();

    return Promise.all(
      sorted.map(async (provider) => {
        const availability = await this.repository.getProviderAvailability(provider.id);
        const availableToday = availability
          ? this.filterService.isAvailableToday(availability)
          : false;

        const categoryNames = provider.categoryIds
          .map(id => categories.find(c => c.id === id)?.name)
          .filter(Boolean) as string[];

        return {
          id: provider.id,
          displayName: provider.displayName,
          avatar: provider.avatar,
          rating: provider.rating,
          reviewCount: provider.reviewCount,
          distance: this.calculateMockDistance(),
          responseTime: provider.responseTime,
          availableToday,
          categoryNames,
        };
      })
    );
  }

  // Booking Services
  async createBooking(data: {
    customerId: string;
    providerId: string;
    categoryId: string;
    townId: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    notes?: string;
  }): Promise<Booking> {
    const booking = await this.repository.createBooking({
      ...data,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    return booking;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return this.repository.getBookingsByCustomer(customerId);
  }

  async getProviderBookings(providerId: string): Promise<Booking[]> {
    return this.repository.getBookingsByProvider(providerId);
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    return this.repository.getBookingById(bookingId);
  }

  async getBookingDetails(bookingId: string): Promise<BookingDetailsViewModel | null> {
    const booking = await this.repository.getBookingById(bookingId);
    if (!booking) return null;

    const [provider, category, town, categories] = await Promise.all([
      this.repository.getProviderById(booking.providerId),
      this.repository.getCategories().then(cats => cats.find(c => c.id === booking.categoryId)),
      this.repository.getTownById(booking.townId),
      this.repository.getCategories(),
    ]);

    if (!provider || !category || !town) return null;

    const availability = await this.repository.getProviderAvailability(provider.id);
    const availableToday = availability
      ? this.filterService.isAvailableToday(availability)
      : false;

    const categoryNames = provider.categoryIds
      .map(id => categories.find(c => c.id === id)?.name)
      .filter(Boolean) as string[];

    const providerListItem: ProviderListItem = {
      id: provider.id,
      displayName: provider.displayName,
      avatar: provider.avatar,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      distance: this.calculateMockDistance(),
      responseTime: provider.responseTime,
      availableToday,
      categoryNames,
    };

    return {
      booking,
      provider: providerListItem,
      category,
      town,
      canChat: booking.status !== 'cancelled',
      canPay: booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled',
      canCancel: booking.status === 'pending' || booking.status === 'confirmed',
    };
  }

  async processPayment(bookingId: string, amount: number): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      const booking = await this.repository.updateBookingPayment(bookingId, 'paid_in_app');
      return { success: true, booking };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled'): Promise<Booking> {
    return this.repository.updateBookingStatus(bookingId, status);
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    return this.repository.updateBooking(bookingId, updates);
  }

  // Chat Services
  async getChatThread(bookingId: string): Promise<ChatThread | null> {
    return this.repository.getChatThread(bookingId);
  }

  async sendMessage(
    bookingId: string,
    senderId: string,
    senderType: 'customer' | 'provider',
    content: string
  ): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
    // Validate no phone numbers
    if (this.phoneService.containsPhoneNumber(content)) {
      return {
        success: false,
        error: this.phoneService.getWarningMessage(),
      };
    }

    try {
      const message = await this.repository.sendMessage({
        bookingId,
        senderId,
        senderType,
        content,
        read: false,
      });
      return { success: true, message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Notification Services
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.repository.getNotifications(userId);
  }

  // Utility Services
  getAvailableDates(count?: number) {
    return this.dateTimeService.getAvailableDates(count);
  }

  getAvailableTimeSlots() {
    return this.dateTimeService.getAvailableTimeSlots();
  }

  formatTime(time: string) {
    return this.dateTimeService.formatTime(time);
  }

  detectPhoneNumber(text: string) {
    return this.phoneService.containsPhoneNumber(text);
  }

  // Mock Data Toggle Methods (for testing edge cases)
  getMockToggles() {
    return this.repository.mockToggles;
  }

  setMockToggle(key: keyof typeof this.repository.mockToggles, value: boolean) {
    this.repository.mockToggles[key] = value;
  }

  resetMockToggles() {
    this.repository.resetMockToggles();
  }

  resetData() {
    this.repository.resetData();
  }

  private calculateMockDistance(): string {
    const miles = Math.floor(Math.random() * 10) + 1;
    return `${miles} mi away`;
  }
}