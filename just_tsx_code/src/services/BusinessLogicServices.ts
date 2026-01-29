import type { Provider, ProviderAvailability } from '@/domain/models';

/**
 * Service for filtering providers based on town, category, and availability
 */
export class ProviderFilterService {
  /**
   * Check if provider is available on a specific date and time
   */
  public isProviderAvailable(
    availability: ProviderAvailability,
    date: string,
    time: string
  ): boolean {
    if (!availability.enabled) return false;

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Check if it's a day off
    const isDayOff = availability.dayOffExceptions.some(
      exception => exception.date === date
    );
    if (isDayOff) return false;

    // Check if provider works on this day
    const scheduleForDay = availability.weeklySchedule.find(
      slot => slot.dayOfWeek === dayOfWeek
    );
    if (!scheduleForDay) return false;

    // Check if requested time falls within working hours
    const requestedTime = this.parseTime(time);
    const startTime = this.parseTime(scheduleForDay.startTime);
    const endTime = this.parseTime(scheduleForDay.endTime);

    return requestedTime >= startTime && requestedTime < endTime;
  }

  /**
   * Filter providers by town, category, and availability
   */
  public filterAvailableProviders(
    providers: Provider[],
    availabilities: ProviderAvailability[],
    filters: {
      townId: string;
      categoryId?: string;
      date?: string;
      time?: string;
    }
  ): Provider[] {
    return providers.filter(provider => {
      // Must be enabled
      if (!provider.enabled) return false;

      // Must serve the town
      if (!provider.townIds.includes(filters.townId)) return false;

      // Must offer the category (if specified)
      if (filters.categoryId && !provider.categoryIds.includes(filters.categoryId)) {
        return false;
      }

      // Must be available at the requested date/time (if specified)
      if (filters.date && filters.time) {
        const availability = availabilities.find(a => a.providerId === provider.id);
        if (!availability) return false;
        if (!this.isProviderAvailable(availability, filters.date, filters.time)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Check if provider is available today
   */
  public isAvailableToday(availability: ProviderAvailability): boolean {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    const timeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
    
    return this.isProviderAvailable(availability, today, timeString);
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes since midnight
  }
}

/**
 * Service for detecting phone numbers in text
 */
export class PhoneNumberDetectionService {
  private readonly patterns = [
    // +1-123-456-7890
    /\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/,
    // (123) 456-7890
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    // 123.456.7890
    /\d{3}[-.]\d{3}[-.]\d{4}/,
    // International format: +XX XXX XXX XXXX
    /\+\d{1,3}\s?\d{1,4}\s?\d{1,4}\s?\d{1,9}/,
    // Consecutive digits: 1234567890
    /\b\d{10,}\b/,
  ];

  /**
   * Detect if text contains a phone number
   */
  public containsPhoneNumber(text: string): boolean {
    return this.patterns.some(pattern => pattern.test(text));
  }

  /**
   * Extract phone numbers from text
   */
  public extractPhoneNumbers(text: string): string[] {
    const matches: string[] = [];
    this.patterns.forEach(pattern => {
      const found = text.match(pattern);
      if (found) {
        matches.push(...found);
      }
    });
    return [...new Set(matches)]; // Remove duplicates
  }

  /**
   * Get warning message for phone number detection
   */
  public getWarningMessage(): string {
    return 'For your safety, phone numbers are not allowed. Please use in-app communication features.';
  }
}

/**
 * Service for date/time utilities
 */
export class DateTimeService {
  /**
   * Get available dates starting from today
   */
  public getAvailableDates(count: number = 7): Array<{ value: string; label: string }> {
    const dates: Array<{ value: string; label: string }> = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const value = date.toISOString().split('T')[0];
      let label: string;
      
      if (i === 0) {
        label = 'Today';
      } else if (i === 1) {
        label = 'Tomorrow';
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      dates.push({ value, label });
    }

    return dates;
  }

  /**
   * Get available time slots
   */
  public getAvailableTimeSlots(): string[] {
    return [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];
  }

  /**
   * Format time for display (24h to 12h)
   */
  public formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }
}