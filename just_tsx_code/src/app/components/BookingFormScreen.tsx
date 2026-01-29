import { ArrowLeft, MapPin, Calendar, Clock, FileText, Camera, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface BookingFormData {
  address: string;
  date: string;
  time: string;
  notes: string;
  photos: string[];
}

interface BookingFormScreenProps {
  onBack: () => void;
  onSubmit: (data: BookingFormData) => void;
  initialData?: Partial<BookingFormData>;
}

export function BookingFormScreen({ onBack, onSubmit, initialData }: BookingFormScreenProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    address: initialData?.address || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    notes: initialData?.notes || '',
    photos: initialData?.photos || [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

  const handleSubmit = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handlePhotoUpload = () => {
    // Mock photo upload - in real app, would use file input
    const mockPhotoUrl = '';
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, mockPhotoUrl],
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const isFormValid = formData.address.trim() && formData.date && formData.time;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <p className="text-sm text-gray-500">When and where do you need service?</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 px-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Service Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, address: e.target.value }));
                setErrors(prev => ({ ...prev, address: undefined }));
              }}
              placeholder="123 Main Street, City, Province"
              className={`w-full px-4 py-3.5 rounded-2xl border ${
                errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              } focus:outline-none focus:border-[#5DD9C1] focus:ring-2 focus:ring-[#5DD9C1]/20 transition-all`}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1.5 px-1">{errors.address}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 px-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, date: e.target.value }));
                setErrors(prev => ({ ...prev, date: undefined }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3.5 rounded-2xl border ${
                errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              } focus:outline-none focus:border-[#5DD9C1] focus:ring-2 focus:ring-[#5DD9C1]/20 transition-all`}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1.5 px-1">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 px-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Preferred Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, time: e.target.value }));
                setErrors(prev => ({ ...prev, time: undefined }));
              }}
              className={`w-full px-4 py-3.5 rounded-2xl border ${
                errors.time ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              } focus:outline-none focus:border-[#5DD9C1] focus:ring-2 focus:ring-[#5DD9C1]/20 transition-all`}
            />
            {errors.time && (
              <p className="text-sm text-red-600 mt-1.5 px-1">{errors.time}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 px-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific instructions or details..."
              rows={4}
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-[#5DD9C1] focus:ring-2 focus:ring-[#5DD9C1]/20 transition-all resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 px-1">
              <Camera className="w-4 h-4 inline mr-1" />
              Photos (Optional)
            </label>
            <div className="space-y-3">
              {/* Photo Grid */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handlePhotoUpload}
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-8 flex flex-col items-center justify-center hover:border-[#5DD9C1] hover:bg-[#5DD9C1]/5 transition-all"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Add Photos</p>
                <p className="text-xs text-gray-500 mt-1">
                  Help providers understand your needs
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-area-bottom">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-semibold shadow-lg transition-all ${
            isFormValid
              ? 'bg-gradient-to-r from-[#5DD9C1] to-[#4BC4AC] text-white hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Find Providers
        </motion.button>
      </div>
    </div>
  );
}