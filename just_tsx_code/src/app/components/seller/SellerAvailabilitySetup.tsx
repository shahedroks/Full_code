import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Check, X, ChevronLeft } from 'lucide-react';
import type { TimeSlot, DayOffException } from '@/domain/models';

interface SellerAvailabilitySetupProps {
  onBack: () => void;
  onSave: (schedule: TimeSlot[], dayOffs: DayOffException[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function SellerAvailabilitySetup({ onBack, onSave }: SellerAvailabilitySetupProps) {
  const [schedule, setSchedule] = useState<TimeSlot[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
  ]);

  const [dayOffs, setDayOffs] = useState<DayOffException[]>([]);
  const [newDayOff, setNewDayOff] = useState('');

  const toggleDay = (dayOfWeek: number) => {
    const exists = schedule.find(s => s.dayOfWeek === dayOfWeek);
    if (exists) {
      setSchedule(schedule.filter(s => s.dayOfWeek !== dayOfWeek));
    } else {
      setSchedule([...schedule, { dayOfWeek, startTime: '09:00', endTime: '17:00' }]);
    }
  };

  const updateTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(schedule.map(s =>
      s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
    ));
  };

  const addDayOff = () => {
    if (newDayOff) {
      setDayOffs([...dayOffs, { date: newDayOff }]);
      setNewDayOff('');
    }
  };

  const removeDayOff = (date: string) => {
    setDayOffs(dayOffs.filter(d => d.date !== date));
  };

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#408AF1] via-[#4c96f3] to-[#5ca3f5] px-4 py-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 mb-4 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-semibold mb-2">Availability</h1>
            <p className="text-white/90 text-sm">Manage your working schedule</p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
        {/* Working Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Working Days
          </h3>
          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day, index) => {
              const slot = schedule.find(s => s.dayOfWeek === day.value);
              const isActive = !!slot;

              return (
                <motion.div
                  key={day.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className={`bg-white rounded-2xl p-4 border transition-all ${
                    isActive 
                      ? 'border-[#408AF1]/20 shadow-sm shadow-[#408AF1]/5' 
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {day.label}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDay(day.value)}
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#408AF1] to-[5ca3f5] shadow-lg shadow-[#408AF1]/30' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <motion.div
                        animate={{ x: isActive ? 28 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </motion.button>
                  </div>

                  {isActive && slot && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-2 block">Start Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateTime(day.value, 'startTime', e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 outline-none focus:border-[#408AF1] focus:ring-2 focus:ring-[#408AF1]/20 transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-2 block">End Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateTime(day.value, 'endTime', e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 outline-none focus:border-[#408AF1] focus:ring-2 focus:ring-[#408AF1]/20 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Days Off */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Days Off
          </h3>
          
          <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-3 shadow-sm">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={newDayOff}
                  onChange={(e) => setNewDayOff(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 outline-none focus:border-[#408AF1] focus:ring-2 focus:ring-[#408AF1]/20 transition-all font-medium"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addDayOff}
                disabled={!newDayOff}
                className="px-5 bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#408AF1]/30 disabled:shadow-none transition-all"
              >
                Add
              </motion.button>
            </div>
          </div>

          {dayOffs.length > 0 ? (
            <div className="space-y-2">
              {dayOffs.map((dayOff, index) => (
                <motion.div
                  key={dayOff.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(dayOff.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(dayOff.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeDayOff(dayOff.date)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 bg-white rounded-2xl border border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">No days off scheduled</p>
              <p className="text-xs text-gray-500">Add dates when you're unavailable</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSave(schedule, dayOffs)}
          className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#408AF1]/30 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Save Availability
        </motion.button>
      </div>
    </div>
  );
}