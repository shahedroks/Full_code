// Service structure with sub-sections and add-ons

export interface SubSection {
  id: string;
  name: string;
  basePrice?: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface ServiceStructure {
  categoryId: string;
  categoryName: string;
  subSections: SubSection[];
  addOns: AddOn[];
}

export const SERVICE_STRUCTURES: ServiceStructure[] = [
  {
    categoryId: 'cat1',
    categoryName: 'Residential Cleaning',
    subSections: [
      { id: 'regular-cleaning', name: 'Regular Cleaning', basePrice: 80 },
      { id: 'deep-cleaning', name: 'Deep Cleaning', basePrice: 150 },
      { id: 'move-in-out', name: 'Move-In / Move-Out', basePrice: 200 },
    ],
    addOns: [
      { id: 'inside-fridge', name: 'Inside fridge', price: 25 },
      { id: 'inside-oven', name: 'Inside oven', price: 30 },
      { id: 'inside-cabinets', name: 'Inside cabinets', price: 40 },
      { id: 'window-cleaning', name: 'Window cleaning', price: 35 },
      { id: 'balcony', name: 'Balcony', price: 20 },
      { id: 'extra-rooms', name: 'Extra rooms', price: 50 },
      { id: 'extra-bathrooms', name: 'Extra bathrooms', price: 40 },
    ],
  },
  {
    categoryId: 'cat2',
    categoryName: 'Commercial Cleaning',
    subSections: [
      { id: 'office-cleaning', name: 'Office Cleaning', basePrice: 120 },
      { id: 'shop-store-cleaning', name: 'Shop / Store Cleaning', basePrice: 150 },
    ],
    addOns: [
      { id: 'carpet-shampoo', name: 'Carpet shampoo', price: 60 },
      { id: 'window-cleaning', name: 'Window cleaning', price: 45 },
      { id: 'trash-removal', name: 'Trash removal', price: 30 },
      { id: 'after-hours-service', name: 'After-hours service', price: 50 },
    ],
  },
  {
    categoryId: 'cat3',
    categoryName: 'Contract Cleaning',
    subSections: [
      { id: 'daily', name: 'Daily', basePrice: 500 },
      { id: 'weekly', name: 'Weekly', basePrice: 300 },
      { id: 'monthly', name: 'Monthly', basePrice: 800 },
    ],
    addOns: [
      { id: 'weekend-service', name: 'Weekend service', price: 100 },
      { id: 'early-morning-late-night', name: 'Early morning / late night', price: 75 },
      { id: 'extra-rooms', name: 'Extra rooms', price: 150 },
    ],
  },
  {
    categoryId: 'cat4',
    categoryName: 'Floor Waxing',
    subSections: [
      { id: 'residential', name: 'Residential', basePrice: 100 },
      { id: 'commercial', name: 'Commercial', basePrice: 200 },
    ],
    addOns: [
      { id: 'strip-old-wax', name: 'Strip old wax', price: 50 },
      { id: 'extra-polish', name: 'Extra polish', price: 40 },
      { id: 'stairs', name: 'Stairs', price: 60 },
    ],
  },
  {
    categoryId: 'cat5',
    categoryName: 'Pressure Washing',
    subSections: [
      { id: 'driveways', name: 'Driveways', basePrice: 80 },
      { id: 'patios', name: 'Patios', basePrice: 70 },
      { id: 'sidewalks', name: 'Sidewalks', basePrice: 60 },
      { id: 'building-exterior', name: 'Building exterior', basePrice: 150 },
    ],
    addOns: [
      { id: 'oil-stain-removal', name: 'Oil stain removal', price: 40 },
      { id: 'fence', name: 'Fence', price: 50 },
      { id: 'deck', name: 'Deck', price: 60 },
      { id: 'garage-floor', name: 'Garage floor', price: 45 },
    ],
  },
  {
    categoryId: 'cat6',
    categoryName: 'Grass Cutting',
    subSections: [
      { id: 'small-yard', name: 'Small yard', basePrice: 40 },
      { id: 'medium-yard', name: 'Medium yard', basePrice: 60 },
      { id: 'large-yard', name: 'Large yard', basePrice: 90 },
    ],
    addOns: [
      { id: 'edge-trimming', name: 'Edge trimming', price: 15 },
      { id: 'weed-removal', name: 'Weed removal', price: 25 },
      { id: 'leaf-cleanup', name: 'Leaf cleanup', price: 30 },
      { id: 'waste-removal', name: 'Waste removal', price: 20 },
    ],
  },
  {
    categoryId: 'cat7',
    categoryName: 'Snow Removal',
    subSections: [
      { id: 'driveways', name: 'Driveways', basePrice: 50 },
      { id: 'walkways', name: 'Walkways', basePrice: 35 },
      { id: 'commercial-lots', name: 'Commercial lots', basePrice: 150 },
    ],
    addOns: [
      { id: 'ice-treatment', name: 'Ice treatment', price: 30 },
      { id: 'roof-snow', name: 'Roof snow', price: 100 },
      { id: 'emergency-same-day', name: 'Emergency same-day', price: 75 },
    ],
  },
  {
    categoryId: 'cat8',
    categoryName: 'Laundry',
    subSections: [
      { id: 'wash-dry', name: 'Wash & Dry', basePrice: 30 },
      { id: 'wash-dry-fold', name: 'Wash, Dry & Fold', basePrice: 45 },
      { id: 'ironing', name: 'Ironing', basePrice: 50 },
    ],
    addOns: [
      { id: 'express', name: 'Express', price: 20 },
      { id: 'delicate', name: 'Delicate', price: 15 },
      { id: 'bedding', name: 'Bedding', price: 25 },
    ],
  },
];

export function getServiceStructure(categoryId: string): ServiceStructure | undefined {
  return SERVICE_STRUCTURES.find(s => s.categoryId === categoryId);
}

export function calculateTotalPrice(
  subSectionId: string,
  addOnIds: string[],
  categoryId: string
): number {
  const structure = getServiceStructure(categoryId);
  if (!structure) return 0;

  const subSection = structure.subSections.find(s => s.id === subSectionId);
  const basePrice = subSection?.basePrice || 0;

  const addOnsTotal = addOnIds.reduce((sum, addOnId) => {
    const addOn = structure.addOns.find(a => a.id === addOnId);
    return sum + (addOn?.price || 0);
  }, 0);

  return basePrice + addOnsTotal;
}