import type {
  Town,
  ServiceCategory,
  CategoryTownAvailability,
  Provider,
  ProviderAvailability,
  Booking,
  ChatThread,
  ChatMessage,
  Notification,
  Customer,
  TimeSlot,
  BookingStatus,
  ProviderPricing,
} from '@/domain/models';

// Mock Data Repository - Simulates backend data storage
export class MockDataRepository {
  private static instance: MockDataRepository;
  
  // In-memory data stores
  private towns: Town[] = [];
  private categories: ServiceCategory[] = [];
  private categoryTownAvailability: CategoryTownAvailability[] = [];
  private providers: Provider[] = [];
  private providerAvailability: ProviderAvailability[] = [];
  private providerPricing: Map<string, ProviderPricing> = new Map();
  private bookings: Booking[] = [];
  private chatThreads: Map<string, ChatThread> = new Map();
  private notifications: Notification[] = [];
  private customers: Map<string, Customer> = new Map();

  // Mock toggle flags for testing edge cases
  public mockToggles = {
    disableAllTowns: false,
    noSellersAvailable: false,
    paymentAlwaysFails: false,
  };

  private constructor() {
    this.seedMockData();
  }

  public static getInstance(): MockDataRepository {
    if (!MockDataRepository.instance) {
      MockDataRepository.instance = new MockDataRepository();
    }
    return MockDataRepository.instance;
  }

  private seedMockData(): void {
    // Seed Towns - British Columbia towns for Renizo
    this.towns = [
      { id: 'town1', name: 'Terrace', state: 'BC', enabled: true },
      { id: 'town2', name: 'Kitimat', state: 'BC', enabled: true },
      { id: 'town3', name: 'Prince Rupert', state: 'BC', enabled: true },
      { id: 'town4', name: 'Smithers', state: 'BC', enabled: true },
    ];

    // Seed Categories with Sub-sections and Add-ons
    this.categories = [
      { 
        id: 'cat1', 
        name: 'Residential Cleaning', 
        icon: 'Home', 
        description: 'Professional home cleaning services', 
        enabled: true,
        subSections: [
          { id: 'sub1-1', name: 'Regular Cleaning' },
          { id: 'sub1-2', name: 'Deep Cleaning' },
          { id: 'sub1-3', name: 'Move-In / Move-Out' },
        ],
        addons: [
          { id: 'addon1-1', name: 'Inside fridge', price: 25 },
          { id: 'addon1-2', name: 'Inside oven', price: 30 },
          { id: 'addon1-3', name: 'Inside cabinets', price: 40 },
          { id: 'addon1-4', name: 'Window cleaning', price: 50 },
          { id: 'addon1-5', name: 'Balcony', price: 35 },
          { id: 'addon1-6', name: 'Extra rooms', price: 45 },
          { id: 'addon1-7', name: 'Extra bathrooms', price: 40 },
        ]
      },
      { 
        id: 'cat2', 
        name: 'Commercial Cleaning', 
        icon: 'Building2', 
        description: 'Office and commercial space cleaning', 
        enabled: true,
        subSections: [
          { id: 'sub2-1', name: 'Office Cleaning' },
          { id: 'sub2-2', name: 'Shop / Store Cleaning' },
        ],
        addons: [
          { id: 'addon2-1', name: 'Carpet shampoo', price: 100 },
          { id: 'addon2-2', name: 'Window cleaning', price: 75 },
          { id: 'addon2-3', name: 'Trash removal', price: 50 },
          { id: 'addon2-4', name: 'After-hours service', price: 80 },
        ]
      },
      { 
        id: 'cat3', 
        name: 'Contract Cleaning', 
        icon: 'CalendarCheck', 
        description: 'Scheduled recurring cleaning', 
        enabled: true,
        subSections: [
          { id: 'sub3-1', name: 'Daily' },
          { id: 'sub3-2', name: 'Weekly' },
          { id: 'sub3-3', name: 'Monthly' },
        ],
        addons: [
          { id: 'addon3-1', name: 'Weekend service', price: 60 },
          { id: 'addon3-2', name: 'Early morning / late night', price: 50 },
          { id: 'addon3-3', name: 'Extra rooms', price: 45 },
        ]
      },
      { 
        id: 'cat4', 
        name: 'Floor Waxing', 
        icon: 'Sparkles', 
        description: 'Professional floor care', 
        enabled: true,
        subSections: [
          { id: 'sub4-1', name: 'Residential' },
          { id: 'sub4-2', name: 'Commercial' },
        ],
        addons: [
          { id: 'addon4-1', name: 'Strip old wax', price: 120 },
          { id: 'addon4-2', name: 'Extra polish', price: 70 },
          { id: 'addon4-3', name: 'Stairs', price: 90 },
        ]
      },
      { 
        id: 'cat5', 
        name: 'Pressure Washing', 
        icon: 'Droplets', 
        description: 'Power washing services', 
        enabled: true,
        subSections: [
          { id: 'sub5-1', name: 'Driveways' },
          { id: 'sub5-2', name: 'Patios' },
          { id: 'sub5-3', name: 'Sidewalks' },
          { id: 'sub5-4', name: 'Building exterior' },
        ],
        addons: [
          { id: 'addon5-1', name: 'Oil stain removal', price: 85 },
          { id: 'addon5-2', name: 'Fence', price: 100 },
          { id: 'addon5-3', name: 'Deck', price: 120 },
          { id: 'addon5-4', name: 'Garage floor', price: 80 },
        ]
      },
      { 
        id: 'cat6', 
        name: 'Grass Cutting', 
        icon: 'Scissors', 
        description: 'Lawn maintenance services', 
        enabled: true,
        subSections: [
          { id: 'sub6-1', name: 'Small yard' },
          { id: 'sub6-2', name: 'Medium yard' },
          { id: 'sub6-3', name: 'Large yard' },
        ],
        addons: [
          { id: 'addon6-1', name: 'Edge trimming', price: 30 },
          { id: 'addon6-2', name: 'Weed removal', price: 40 },
          { id: 'addon6-3', name: 'Leaf cleanup', price: 50 },
          { id: 'addon6-4', name: 'Waste removal', price: 35 },
        ]
      },
      { 
        id: 'cat7', 
        name: 'Snow Removal', 
        icon: 'Snowflake', 
        description: 'Winter snow clearing', 
        enabled: true,
        subSections: [
          { id: 'sub7-1', name: 'Driveways' },
          { id: 'sub7-2', name: 'Walkways' },
          { id: 'sub7-3', name: 'Commercial lots' },
        ],
        addons: [
          { id: 'addon7-1', name: 'Ice treatment', price: 45 },
          { id: 'addon7-2', name: 'Roof snow', price: 150 },
          { id: 'addon7-3', name: 'Emergency same-day', price: 100 },
        ]
      },
      { 
        id: 'cat8', 
        name: 'Laundry', 
        icon: 'Shirt', 
        description: 'Laundry and ironing services', 
        enabled: true,
        subSections: [
          { id: 'sub8-1', name: 'Wash & Dry' },
          { id: 'sub8-2', name: 'Wash, Dry & Fold' },
          { id: 'sub8-3', name: 'Ironing' },
        ],
        addons: [
          { id: 'addon8-1', name: 'Express', price: 20 },
          { id: 'addon8-2', name: 'Delicate', price: 15 },
          { id: 'addon8-3', name: 'Bedding', price: 35 },
        ]
      },
    ];

    // Seed Category-Town Availability (based on actual provider availability)
    // Terrace (town1): Residential Cleaning, Commercial Cleaning, Contract Cleaning, Floor Waxing, Pressure Washing, Grass Cutting, Snow Removal, Laundry
    // Kitimat (town2): Residential Cleaning, Commercial Cleaning, Contract Cleaning, Floor Waxing, Pressure Washing, Grass Cutting, Snow Removal, Laundry
    // Prince Rupert (town3): Residential Cleaning, Commercial Cleaning, Contract Cleaning, Floor Waxing, Pressure Washing, Grass Cutting, Snow Removal, Laundry
    // Smithers (town4): Residential Cleaning, Commercial Cleaning, Contract Cleaning, Floor Waxing, Pressure Washing, Grass Cutting, Snow Removal, Laundry
    
    const categoryTownMapping = [
      // Terrace (town1)
      { categoryId: 'cat1', townId: 'town1', enabled: true }, // Residential Cleaning
      { categoryId: 'cat2', townId: 'town1', enabled: true }, // Commercial Cleaning
      { categoryId: 'cat3', townId: 'town1', enabled: true }, // Contract Cleaning
      { categoryId: 'cat4', townId: 'town1', enabled: true }, // Floor Waxing
      { categoryId: 'cat5', townId: 'town1', enabled: true }, // Pressure Washing
      { categoryId: 'cat6', townId: 'town1', enabled: true }, // Grass Cutting
      { categoryId: 'cat7', townId: 'town1', enabled: true }, // Snow Removal
      { categoryId: 'cat8', townId: 'town1', enabled: true }, // Laundry
      
      // Kitimat (town2)
      { categoryId: 'cat1', townId: 'town2', enabled: true }, // Residential Cleaning
      { categoryId: 'cat2', townId: 'town2', enabled: true }, // Commercial Cleaning
      { categoryId: 'cat3', townId: 'town2', enabled: true }, // Contract Cleaning
      { categoryId: 'cat4', townId: 'town2', enabled: true }, // Floor Waxing
      { categoryId: 'cat5', townId: 'town2', enabled: true }, // Pressure Washing
      { categoryId: 'cat6', townId: 'town2', enabled: true }, // Grass Cutting
      { categoryId: 'cat7', townId: 'town2', enabled: true }, // Snow Removal
      { categoryId: 'cat8', townId: 'town2', enabled: true }, // Laundry
      
      // Prince Rupert (town3)
      { categoryId: 'cat1', townId: 'town3', enabled: true }, // Residential Cleaning
      { categoryId: 'cat2', townId: 'town3', enabled: true }, // Commercial Cleaning
      { categoryId: 'cat3', townId: 'town3', enabled: true }, // Contract Cleaning
      { categoryId: 'cat4', townId: 'town3', enabled: true }, // Floor Waxing
      { categoryId: 'cat5', townId: 'town3', enabled: true }, // Pressure Washing
      { categoryId: 'cat6', townId: 'town3', enabled: true }, // Grass Cutting
      { categoryId: 'cat7', townId: 'town3', enabled: true }, // Snow Removal
      { categoryId: 'cat8', townId: 'town3', enabled: true }, // Laundry
      
      // Smithers (town4)
      { categoryId: 'cat1', townId: 'town4', enabled: true }, // Residential Cleaning
      { categoryId: 'cat2', townId: 'town4', enabled: true }, // Commercial Cleaning
      { categoryId: 'cat3', townId: 'town4', enabled: true }, // Contract Cleaning
      { categoryId: 'cat4', townId: 'town4', enabled: true }, // Floor Waxing
      { categoryId: 'cat5', townId: 'town4', enabled: true }, // Pressure Washing
      { categoryId: 'cat6', townId: 'town4', enabled: true }, // Grass Cutting
      { categoryId: 'cat7', townId: 'town4', enabled: true }, // Snow Removal
      { categoryId: 'cat8', townId: 'town4', enabled: true }, // Laundry
    ];
    
    this.categoryTownAvailability = categoryTownMapping;

    // Seed Providers
    const providerData = [
      { name: 'Sparkle Home Cleaning', cat: ['cat1', 'cat6', 'cat8'], towns: ['town1', 'town2'], rating: 4.9 }, // Multiple services
      { name: 'Pro Office Clean', cat: ['cat2'], towns: ['town1', 'town2', 'town3'], rating: 4.8 },
      { name: 'Daily Clean Services', cat: ['cat3'], towns: ['town1', 'town4'], rating: 4.7 },
      { name: 'Floor Care Experts', cat: ['cat4'], towns: ['town1', 'town2', 'town3', 'town4'], rating: 4.9 },
      { name: 'Power Wash Pro', cat: ['cat5'], towns: ['town2', 'town3'], rating: 4.6 },
      { name: 'Green Lawn Services', cat: ['cat6'], towns: ['town1', 'town3'], rating: 4.8 },
      { name: 'Snow Clear BC', cat: ['cat7'], towns: ['town1', 'town2'], rating: 4.7 },
      { name: 'Fresh Laundry Co', cat: ['cat8'], towns: ['town3', 'town4'], rating: 4.9 },
      { name: 'Elite Home Cleaning', cat: ['cat1'], towns: ['town3', 'town4'], rating: 4.5 },
      { name: 'Commercial Clean Plus', cat: ['cat2'], towns: ['town1', 'town2', 'town4'], rating: 4.6 },
      { name: 'Contract Clean Services', cat: ['cat3'], towns: ['town2', 'town3'], rating: 4.8 },
      { name: 'Shine Floor Waxing', cat: ['cat4'], towns: ['town1', 'town3'], rating: 4.7 },
      { name: 'Pressure Clean BC', cat: ['cat5'], towns: ['town1', 'town4'], rating: 4.8 },
      { name: 'Lawn Masters', cat: ['cat6'], towns: ['town2', 'town4'], rating: 4.5 },
      { name: 'Winter Snow Removal', cat: ['cat7'], towns: ['town3', 'town4'], rating: 4.6 },
      { name: 'Office Sparkle Services', cat: ['cat2'], towns: ['town1', 'town3', 'town4'], rating: 4.9 },
      { name: 'Commercial Shine Co', cat: ['cat2'], towns: ['town1', 'town2'], rating: 4.7 },
      { name: 'Business Clean Pros', cat: ['cat2'], towns: ['town1', 'town2', 'town3', 'town4'], rating: 4.8 },
      { name: 'Tidy Homes BC', cat: ['cat1'], towns: ['town1', 'town2'], rating: 4.6 },
      { name: 'Fresh Start Cleaning', cat: ['cat1'], towns: ['town1', 'town3', 'town4'], rating: 4.7 },
    ];

    // Avatar mapping for providers
    const providerAvatars = [
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Sparkle Home Cleaning
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Pro Office Clean
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Daily Clean Services
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Floor Care Experts
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Power Wash Pro
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Green Lawn Services
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Snow Clear BC
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Fresh Laundry Co
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Elite Home Cleaning
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Commercial Clean Plus
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Contract Clean Services
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Shine Floor Waxing
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Pressure Clean BC
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Lawn Masters
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Winter Snow Removal
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Office Sparkle Services
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Commercial Shine Co
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Business Clean Pros
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Tidy Homes BC
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Fresh Start Cleaning
    ];

    this.providers = providerData.map((p, i) => ({
      id: `provider${i + 1}`,
      displayName: p.name,
      email: `${p.name.toLowerCase().replace(/[^a-z]/g, '')}@service.com`,
      phone: `+1-555-${String(1000 + i).padStart(4, '0')}`, // NEVER expose to customers
      avatar: providerAvatars[i],
      rating: p.rating,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      categoryIds: Array.isArray(p.cat) ? p.cat : [p.cat], // Handle both array and string
      townIds: p.towns,
      bio: `Professional ${this.categories.find(c => c.id === (Array.isArray(p.cat) ? p.cat[0] : p.cat))?.name} services`,
      responseTime: Math.random() > 0.5 ? 'Usually responds in under 1 hour' : 'Usually responds in 2-4 hours',
      status: Math.random() > 0.3 ? 'active' : 'busy',
      enabled: true,
    }));

    // Seed Provider Availability (standard business hours)
    const standardSchedule: TimeSlot[] = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
    ];

    this.providerAvailability = this.providers.map(p => ({
      providerId: p.id,
      weeklySchedule: standardSchedule,
      dayOffExceptions: [
        { date: '2026-01-20', reason: 'Holiday' },
      ],
      enabled: true,
    }));

    // Seed sample customer
    this.customers.set('customer1', {
      id: 'customer1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0100',
      savedAddresses: ['123 Main Street, Millbrook, NY'],
      preferredTownId: 'town1',
    });

    // Seed sample notifications
    this.notifications = [
      {
        id: 'notif1',
        userId: 'customer1',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Mike\'s Plumbing confirmed your appointment for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        read: false,
      },
      {
        id: 'notif2',
        userId: 'customer1',
        type: 'message',
        title: 'New Message',
        message: 'Elite Electric Co. sent you a message',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
    ];

    // Seed demo bookings for provider (provider1 = Mike Johnson)
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    this.bookings = [
      // Pending requests (need Accept/Decline)
      {
        id: 'booking1',
        customerId: 'customer1',
        providerId: 'provider1',
        categoryId: 'cat1', // Residential Cleaning
        subSectionId: 'sub1-1', // Regular Cleaning
        addonIds: ['addon1-4'], // Window cleaning
        townId: 'town1', // Terrace
        scheduledDate: tomorrow,
        scheduledTime: '10:00',
        address: '456 Oak Avenue, Terrace, BC',
        notes: 'Need regular house cleaning with window cleaning',
        status: 'pending',
        paymentStatus: 'unpaid',
        amount: 150, // For backward compatibility
        totalAmount: 150,
        providerAmount: 135,
        renizoFee: 15,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'booking2',
        customerId: 'customer2',
        providerId: 'provider1',
        categoryId: 'cat6', // Grass Cutting
        subSectionId: 'sub6-2', // Medium yard
        addonIds: ['addon6-1', 'addon6-3'], // Edge trimming, Leaf cleanup
        townId: 'town2', // Kitimat
        scheduledDate: nextWeek,
        scheduledTime: '14:00',
        address: '789 Pine Street, Kitimat, BC',
        notes: 'Medium yard needs mowing with edge trimming and leaf cleanup',
        status: 'pending',
        paymentStatus: 'unpaid',
        amount: 120,
        totalAmount: 120,
      },
      {
        id: 'booking3',
        customerId: 'customer3',
        providerId: 'provider1',
        categoryId: 'cat1', // Residential Cleaning
        subSectionId: 'sub1-2', // Deep Cleaning
        addonIds: ['addon1-1', 'addon1-2'], // Inside fridge, Inside oven
        townId: 'town1', // Terrace
        scheduledDate: tomorrow,
        scheduledTime: '16:00',
        address: '321 Maple Drive, Terrace, BC',
        notes: 'Deep cleaning needed including fridge and oven',
        status: 'pending',
        paymentStatus: 'paid_in_app',
        amount: 285,
        totalAmount: 285,
        providerAmount: 256.50,
        renizoFee: 28.50,
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      },

      // Upcoming confirmed jobs
      {
        id: 'booking4',
        customerId: 'customer4',
        providerId: 'provider1',
        categoryId: 'cat7', // Snow Removal
        subSectionId: 'sub7-1', // Driveways
        addonIds: ['addon7-1'], // Ice treatment
        townId: 'town1', // Terrace
        scheduledDate: today,
        scheduledTime: '15:00',
        address: '567 Elm Street, Terrace, BC',
        notes: 'Driveway snow removal with ice treatment',
        status: 'confirmed',
        paymentStatus: 'paid_in_app',
        amount: 145,
        totalAmount: 145,
        providerAmount: 130.50,
        renizoFee: 14.50,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'booking5',
        customerId: 'customer5',
        providerId: 'provider1',
        categoryId: 'cat8', // Laundry
        subSectionId: 'sub8-2', // Wash, Dry & Fold
        addonIds: ['addon8-1'], // Express
        townId: 'town2', // Kitimat
        scheduledDate: tomorrow,
        scheduledTime: '09:00',
        address: '890 Birch Lane, Kitimat, BC',
        notes: 'Express laundry service - wash, dry and fold',
        status: 'confirmed',
        paymentStatus: 'unpaid',
        amount: 70,
        totalAmount: 70,
        providerAmount: 63,
        renizoFee: 7,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
      },

      // Active job (in-progress)
      {
        id: 'booking6',
        customerId: 'customer6',
        providerId: 'provider1',
        categoryId: 'cat2', // Commercial Cleaning
        subSectionId: 'sub2-1', // Office Cleaning
        addonIds: ['addon2-1', 'addon2-2'], // Carpet shampoo, Window cleaning
        townId: 'town1', // Terrace
        scheduledDate: today,
        scheduledTime: '11:00',
        address: '234 Cedar Court, Terrace, BC',
        notes: 'Office cleaning with carpet shampoo and windows',
        status: 'in-progress',
        paymentStatus: 'paid_in_app',
        amount: 275,
        totalAmount: 275,
        providerAmount: 247.50,
        renizoFee: 27.50,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Add some demo customers for the bookings
    this.customers.set('customer2', {
      id: 'customer2',
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1-555-0101',
      savedAddresses: ['789 Pine Street, Kitimat, BC'],
      preferredTownId: 'town2',
    });

    this.customers.set('customer3', {
      id: 'customer3',
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '+1-555-0102',
      savedAddresses: ['321 Maple Drive, Terrace, BC'],
      preferredTownId: 'town1',
    });

    this.customers.set('customer4', {
      id: 'customer4',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1-555-0103',
      savedAddresses: ['567 Elm Street, Terrace, BC'],
      preferredTownId: 'town1',
    });

    this.customers.set('customer5', {
      id: 'customer5',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1-555-0104',
      savedAddresses: ['890 Birch Lane, Kitimat, BC'],
      preferredTownId: 'town2',
    });

    this.customers.set('customer6', {
      id: 'customer6',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+1-555-0105',
      savedAddresses: ['234 Cedar Court, Terrace, BC'],
      preferredTownId: 'town1',
    });
  }

  // Town Repository Methods
  async getTowns(): Promise<Town[]> {
    await this.simulateNetworkDelay();
    if (this.mockToggles.disableAllTowns) {
      return this.towns.map(t => ({ ...t, enabled: false }));
    }
    return [...this.towns];
  }

  async getTownById(id: string): Promise<Town | null> {
    await this.simulateNetworkDelay();
    return this.towns.find(t => t.id === id) || null;
  }

  // Category Repository Methods
  async getCategories(): Promise<ServiceCategory[]> {
    await this.simulateNetworkDelay();
    return [...this.categories];
  }

  async getCategoriesForTown(townId: string): Promise<ServiceCategory[]> {
    await this.simulateNetworkDelay();
    const availableInTown = this.categoryTownAvailability
      .filter(cta => cta.townId === townId && cta.enabled)
      .map(cta => cta.categoryId);
    
    return this.categories.filter(c => 
      c.enabled && availableInTown.includes(c.id)
    );
  }

  // Provider Repository Methods
  async getProviders(): Promise<Provider[]> {
    await this.simulateNetworkDelay();
    if (this.mockToggles.noSellersAvailable) {
      return [];
    }
    // Remove phone number before returning
    return this.providers.map(this.sanitizeProvider);
  }

  async getProvidersForTown(townId: string): Promise<Provider[]> {
    await this.simulateNetworkDelay();
    if (this.mockToggles.noSellersAvailable) {
      return [];
    }
    return this.providers
      .filter(p => p.enabled && p.townIds.includes(townId))
      .map(this.sanitizeProvider);
  }

  async getProvidersForCategory(categoryId: string, townId: string): Promise<Provider[]> {
    await this.simulateNetworkDelay();
    console.log('Repository: getProvidersForCategory called with categoryId:', categoryId, 'townId:', townId);
    console.log('Repository: All providers:', this.providers.map(p => ({ id: p.id, name: p.displayName, categoryIds: p.categoryIds, townIds: p.townIds, enabled: p.enabled })));
    
    if (this.mockToggles.noSellersAvailable) {
      console.log('Repository: Mock toggle noSellersAvailable is enabled, returning empty array');
      return [];
    }
    const filtered = this.providers
      .filter(p => 
        p.enabled && 
        p.categoryIds.includes(categoryId) &&
        p.townIds.includes(townId)
      );
    console.log('Repository: Filtered providers:', filtered.map(p => ({ id: p.id, name: p.displayName })));
    return filtered.map(this.sanitizeProvider);
  }

  async getProviderById(id: string): Promise<Provider | null> {
    await this.simulateNetworkDelay();
    const provider = this.providers.find(p => p.id === id);
    if (!provider) return null;
    
    console.log('getProviderById - provider before localStorage:', id, { categoryIds: provider.categoryIds, townIds: provider.townIds });
    
    // Try to load saved services from localStorage
    const saved = localStorage.getItem(`provider_services_${id}`);
    console.log('getProviderById - localStorage data:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('getProviderById - parsed data:', parsed);
        provider.categoryIds = parsed.categoryIds;
        provider.townIds = parsed.townIds;
        console.log('getProviderById - provider after update:', { categoryIds: provider.categoryIds, townIds: provider.townIds });
      } catch (error) {
        console.error('Failed to parse saved services:', error);
      }
    }
    
    return this.sanitizeProvider(provider);
  }

  async getProviderAvailability(providerId: string): Promise<ProviderAvailability | null> {
    await this.simulateNetworkDelay();
    return this.providerAvailability.find(pa => pa.providerId === providerId) || null;
  }

  async updateProviderServices(providerId: string, categoryIds: string[], townIds: string[]): Promise<Provider> {
    await this.simulateNetworkDelay();
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) throw new Error('Provider not found');

    provider.categoryIds = categoryIds;
    provider.townIds = townIds;

    // Persist to localStorage
    const serviceData = { categoryIds, townIds };
    localStorage.setItem(`provider_services_${providerId}`, JSON.stringify(serviceData));
    console.log('Saved provider services to localStorage:', providerId, serviceData);

    return this.sanitizeProvider(provider);
  }

  async updateProviderStatus(providerId: string, status: 'active' | 'busy' | 'offline'): Promise<Provider> {
    await this.simulateNetworkDelay();
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) throw new Error('Provider not found');

    provider.status = status;

    return this.sanitizeProvider(provider);
  }

  // Booking Repository Methods
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    await this.simulateNetworkDelay();
    const newBooking: Booking = {
      ...booking,
      id: `booking${this.bookings.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    await this.simulateNetworkDelay();
    return this.bookings.filter(b => b.customerId === customerId);
  }

  async getBookingsByProvider(providerId: string): Promise<Booking[]> {
    await this.simulateNetworkDelay();
    return this.bookings.filter(b => b.providerId === providerId);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    await this.simulateNetworkDelay();
    return this.bookings.find(b => b.id === id) || null;
  }

  async updateBookingPayment(bookingId: string, paymentStatus: 'paid_in_app' | 'paid_outside'): Promise<Booking> {
    await this.simulateNetworkDelay();
    
    if (this.mockToggles.paymentAlwaysFails) {
      throw new Error('Payment processing failed');
    }

    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.paymentStatus = paymentStatus;
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    await this.simulateNetworkDelay();

    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    await this.simulateNetworkDelay();

    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    Object.assign(booking, updates);
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  // Chat Repository Methods
  async getChatThread(bookingId: string): Promise<ChatThread | null> {
    await this.simulateNetworkDelay();
    return this.chatThreads.get(bookingId) || null;
  }

  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    await this.simulateNetworkDelay();
    
    const newMessage: ChatMessage = {
      ...message,
      id: `msg${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    let thread = this.chatThreads.get(message.bookingId);
    if (!thread) {
      const booking = this.bookings.find(b => b.id === message.bookingId);
      if (!booking) throw new Error('Booking not found');

      thread = {
        bookingId: message.bookingId,
        customerId: booking.customerId,
        providerId: booking.providerId,
        messages: [],
        unreadCount: 0,
      };
      this.chatThreads.set(message.bookingId, thread);
    }

    thread.messages.push(newMessage);
    thread.lastMessage = newMessage;
    thread.unreadCount++;

    return newMessage;
  }

  // Notification Repository Methods
  async getNotifications(userId: string): Promise<Notification[]> {
    await this.simulateNetworkDelay();
    return this.notifications.filter(n => n.userId === userId);
  }

  // Customer Repository Methods
  async getCustomer(id: string): Promise<Customer | null> {
    await this.simulateNetworkDelay();
    return this.customers.get(id) || null;
  }

  // Provider Pricing Repository Methods
  async getProviderPricing(providerId: string): Promise<ProviderPricing | null> {
    await this.simulateNetworkDelay();
    
    // Try to load from localStorage first
    const saved = localStorage.getItem(`provider_pricing_${providerId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.providerPricing.set(providerId, parsed);
        return parsed;
      } catch (error) {
        console.error('Failed to parse saved pricing:', error);
      }
    }
    
    return this.providerPricing.get(providerId) || null;
  }

  async saveProviderPricing(pricing: ProviderPricing): Promise<ProviderPricing> {
    await this.simulateNetworkDelay();
    this.providerPricing.set(pricing.providerId, pricing);
    
    // Persist to localStorage
    localStorage.setItem(`provider_pricing_${pricing.providerId}`, JSON.stringify(pricing));
    
    return pricing;
  }

  // Utility Methods
  private sanitizeProvider(provider: Provider): Provider {
    // Remove phone number for customer-facing APIs
    const { phone, ...rest } = provider;
    return { ...rest, phone: '' } as Provider;
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  }

  // Reset methods for testing
  public resetMockToggles(): void {
    this.mockToggles = {
      disableAllTowns: false,
      noSellersAvailable: false,
      paymentAlwaysFails: false,
    };
  }

  public resetData(): void {
    this.bookings = [];
    this.chatThreads.clear();
    this.notifications = [];
    this.seedMockData();
  }
}