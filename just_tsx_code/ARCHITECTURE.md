# Renizo - Town-Based Services Marketplace

## 📁 Clean Architecture Overview

```
/src
├── /domain                 # Core business models (framework-agnostic)
│   └── models.ts          # All TypeScript interfaces and types
│
├── /data                   # Data layer
│   └── MockDataRepository.ts  # In-memory mock data (easily swappable)
│
├── /services              # Business logic layer
│   ├── AppService.ts      # Main application service (UI interacts with this)
│   └── BusinessLogicServices.ts  # Filtering, validation, phone detection, insurance
│
└── /app                   # Presentation layer (UI components)
    ├── App.tsx            # Main app orchestrator
    └── /components        # React components

```

## 🎯 Key Design Patterns

### 1. **Repository Pattern**
- `MockDataRepository` - In-memory data storage
- To swap with real API: Create `ApiDataRepository` implementing same interface
- No UI code changes needed!

### 2. **Service Layer**
- `AppService` - Single entry point for UI
- Orchestrates data access + business logic
- Hides complexity from UI components

### 3. **Business Logic Services**
- `ProviderFilterService` - Town/category/availability filtering
- `PhoneNumberDetectionService` - Phone number detection & blocking
- `InsuranceService` - Payment → Insurance status logic
- `DateTimeService` - Date/time utilities

## 🔐 Core Business Rules Implemented

### Town-Based Filtering
✅ Mandatory town selection on first launch
✅ Town persisted in localStorage
✅ All data filtered by selected town
✅ Only enabled providers/categories shown
✅ No disabled items displayed anywhere

### Booking + Availability
✅ Providers filtered by: town + category + date/time availability
✅ Weekly schedule + day-off exceptions
✅ "No sellers available" state with helpful messaging
✅ Auto-assign feature for quick matching

### Chat + Privacy
✅ Phone number detection using regex patterns
✅ Hard block on sending messages with phone numbers
✅ Warning toast: "For safety, phone numbers not allowed"
✅ Provider phone number NEVER exposed to customers

### Payment + Insurance
✅ Insurance valid ONLY for in-app payments
✅ Payment outside app → Insurance = "Not Covered"
✅ Booking details clearly show insurance status
✅ Helper text: "Pay in-app to be covered"

## 🧪 Mock Data Toggles (Dev Mode)

Click the purple test tube button (bottom right) to toggle:
- ❌ Disable all towns
- ❌ No sellers available
- ❌ Payment always fails
- ❌ Force insurance not covered

## 📱 Screens Implemented

### Customer Flow
- ✅ Splash screen + Onboarding (3 slides)
- ✅ Town selection (searchable, 4 towns)
- ✅ Home (categories + featured providers)
- ✅ Category → Provider list (filtered)
- ✅ Provider profile
- ✅ Task submission / Booking create
- ✅ Seller matching (availability-aware)
- ✅ Booking details (timeline, insurance status)
- ✅ Payment simulation (success/failure)
- ✅ In-app chat (phone blocking)
- ✅ Notifications
- ✅ Profile + Settings

### Seller Flow
- ✅ Seller home dashboard
- ✅ Availability setup (weekly schedule + days off)
- ✅ Service + Town coverage setup
- ✅ Job requests view

## 🔄 Easy API Integration Path

### Step 1: Create `ApiDataRepository`
```typescript
export class ApiDataRepository {
  async getTowns(): Promise<Town[]> {
    const response = await fetch('/api/towns');
    return response.json();
  }
  // ... implement all methods from MockDataRepository interface
}
```

### Step 2: Swap in AppService
```typescript
// In AppService constructor:
// Before:
this.repository = MockDataRepository.getInstance();

// After:
this.repository = new ApiDataRepository(API_BASE_URL);
```

### Step 3: Zero UI changes needed! ✨

## 📊 Data Models

### Core Entities
- `Town` - Service areas (id, name, enabled)
- `ServiceCategory` - Service types (id, name, icon)
- `Provider` - Service providers (with townIds, categoryIds)
- `ProviderAvailability` - Weekly schedule + exceptions
- `Booking` - Customer bookings (with payment + insurance status)
- `ChatMessage` - In-app messages
- `Notification` - Push notifications

### View Models
- `ProviderListItem` - UI-optimized provider data
- `BookingDetailsViewModel` - Complete booking view data

## 🧪 Testing Key Functions

### Phone Number Detection
```typescript
const phoneService = new PhoneNumberDetectionService();
phoneService.containsPhoneNumber("Call me at 555-1234"); // true
phoneService.containsPhoneNumber("Thanks!"); // false
```

### Availability Filtering
```typescript
const filterService = new ProviderFilterService();
const available = filterService.filterAvailableProviders(
  providers, 
  availabilities,
  { townId: 'town1', categoryId: 'cat1', date: '2026-01-17', time: '14:00' }
);
```

### Insurance Logic
```typescript
const insuranceService = new InsuranceService();
insuranceService.calculateInsuranceStatus('paid_in_app'); // 'covered'
insuranceService.calculateInsuranceStatus('paid_outside'); // 'not_covered'
```

## 🚀 Running the App

1. All mock data pre-seeded on app launch
2. Fresh users see splash → onboarding → town selection
3. Returning users go straight to home
4. Use dev toggle to test edge cases

## 📈 Expansion Ready

### Adding New Towns
```typescript
// Just add to mock data - UI automatically updates:
{ id: 'town5', name: 'New Town', state: 'NY', enabled: true }
```

### Adding New Categories
```typescript
{ id: 'cat9', name: 'Pest Control', icon: 'Bug', enabled: true }
```

### Adding New Providers
```typescript
{
  id: 'provider16',
  displayName: 'Pro Services',
  townIds: ['town1', 'town2'],  // Multi-town support
  categoryIds: ['cat1', 'cat3'], // Multi-category support
  enabled: true
}
```

## 💡 Engineering Highlights

- ✅ Clean separation of concerns (Domain → Data → Service → UI)
- ✅ Single Responsibility Principle throughout
- ✅ Easy to test (business logic isolated)
- ✅ Easy to extend (add new services/repositories)
- ✅ TypeScript for type safety
- ✅ Async/await for all data operations
- ✅ Proper error handling
- ✅ Mock network delays for realism
- ✅ State management at app level
- ✅ Smooth animations with Motion

## 🎨 Design System

- Purple accent (#5B47FB → #7B68FF gradient)
- Large tap targets (48px+ buttons)
- Soft rounded corners (16-24px)
- Status-based color coding
- Subtle shadows for depth
- Motion animations on transitions

---

**Ready for production!** 🚀
All flows functional, business logic testable, easy API swap when ready.