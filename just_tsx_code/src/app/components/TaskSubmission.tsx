import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, FileText, ChevronLeft, Sparkles, ChevronDown, Package, Plus } from 'lucide-react';
import { AppService } from '@/services/AppService';
import type { ServiceCategory } from '@/domain/models';
import { getServiceStructure } from '@/app/data/serviceStructure';
import { Calendar } from '@/app/components/Calendar';

interface TaskSubmissionProps {
  selectedTownId: string;
  onBack: () => void;
  onSubmit: (task: any) => void;
}

export function TaskSubmission({ selectedTownId, onBack, onSubmit }: TaskSubmissionProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    subSectionId: '',
    addOnId: '',
    date: '',
    time: '',
    address: '',
    notes: '',
  });

  const appService = AppService.getInstance();

  useEffect(() => {
    loadCategories();
  }, [selectedTownId]);

  const loadCategories = async () => {
    setLoading(true);
    const fetchedCategories = await appService.getCategoriesForTown(selectedTownId);
    setCategories(fetchedCategories);
    setLoading(false);
  };

  const dates = appService.getAvailableDates(7);
  const timeOptions = ['Morning (8AM - 12PM)', 'Noon (12PM - 3PM)', 'Afternoon (3PM - 6PM)'];

  const serviceStructure = formData.categoryId ? getServiceStructure(formData.categoryId) : null;

  const handleCategoryChange = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryId,
      subSectionId: '',
      addOnId: '',
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Format date as YYYY-MM-DD for form data
    const formattedDate = date.toISOString().split('T')[0];
    setFormData({ ...formData, date: formattedDate });
    setIsCalendarOpen(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleSubmit = () => {
    if (formData.categoryId && formData.subSectionId && formData.date && formData.time && formData.address) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.categoryId && formData.subSectionId && formData.date && formData.time && formData.address;

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white font-medium mb-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl text-white">Create Booking</h2>
        <p className="text-sm text-white/80 mt-1">Tell us what you need help with</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Service Type Dropdown */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Service Type</span>
            <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors appearance-none pr-10"
            >
              <option value="">Select a service</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Sub-section Dropdown */}
        {formData.categoryId && serviceStructure && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="sub-section"
          >
            <label className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Service Sub-section</span>
              <span className="text-red-300">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.subSectionId}
                onChange={(e) => setFormData({ ...formData, subSectionId: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors appearance-none pr-10"
              >
                <option value="">Select sub-section</option>
                {serviceStructure.subSections.map(subSection => (
                  <option key={subSection.id} value={subSection.id}>
                    {subSection.name} {subSection.basePrice ? `- $${subSection.basePrice}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Add-ons Dropdown */}
        {serviceStructure && formData.subSectionId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="flex items-center gap-2 mb-3">
              <Plus className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Add-Ons</span>
              <span className="text-sm text-white/70">(Optional)</span>
            </label>
            <div className="relative">
              <select
                value={formData.addOnId}
                onChange={(e) => setFormData({ ...formData, addOnId: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors appearance-none pr-10"
              >
                <option value="">No add-ons</option>
                {serviceStructure.addOns.map(addOn => (
                  <option key={addOn.id} value={addOn.id}>
                    {addOn.name} - +${addOn.price}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Date Calendar */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Preferred Date</span>
            <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatDisplayDate(formData.date)}
              readOnly
              placeholder="Select a date"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors cursor-pointer"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            />
            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {isCalendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 mt-2 w-full"
              >
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  onClose={() => setIsCalendarOpen(false)}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Time Dropdown */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Preferred Time</span>
            <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors appearance-none pr-10"
            >
              <option value="">Select a time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Service Address</span>
            <span className="text-red-300">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter your address"
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Additional Notes</span>
            <span className="text-sm text-white/70">(Optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Describe the issue or any special requirements..."
            rows={4}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors resize-none"
          />
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#2384F4]">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full bg-[#003E93] text-white py-4 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#003E93]/30"
        >
          Find Available Providers
        </button>
      </div>
    </div>
  );
}