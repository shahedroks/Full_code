import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Clock as ClockIcon,
  Star,
  TrendingUp,
  User,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import type { Booking, ProviderStatus } from "@/domain/models";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useState } from "react";

interface SellerJobCardProps {
  booking: Booking & {
    customerName: string;
    categoryName: string;
    townName: string;
  };
  onSelect: () => void;
}

function SellerJobCard({
  booking,
  onSelect,
}: SellerJobCardProps) {
  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#408AF1]/10 to-[#5ca3f5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-[#408AF1]" />
          </div>
          <div>
            <h3 className="font-semibold mb-0.5">
              {booking.categoryName}
            </h3>
            <p className="text-sm text-gray-500">
              {booking.customerName}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${statusColors[booking.status]}`}
        >
          {booking.status === "in-progress"
            ? "Active"
            : booking.status.charAt(0).toUpperCase() +
              booking.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {new Date(booking.scheduledDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              },
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {booking.scheduledTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span>{booking.townName}</span>
      </div>

      {booking.notes && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 flex-1 line-clamp-2">
              {booking.notes}
            </p>
          </div>
        </div>
      )}
    </motion.button>
  );
}

interface SellerHomeProps {
  upcomingJobs: Array<
    Booking & {
      customerName: string;
      categoryName: string;
      townName: string;
    }
  >;
  pendingRequests: Array<
    Booking & {
      customerName: string;
      categoryName: string;
      townName: string;
    }
  >;
  onSelectJob: (jobId: string) => void;
  onManageServices: () => void;
  onManagePricing: () => Promise<void> | void;
  providerStatus: 'active' | 'offline';
  onStatusChange: (status: 'active' | 'offline') => void;
}

export function SellerHome({
  upcomingJobs,
  pendingRequests,
  onSelectJob,
  onManageServices,
  onManagePricing,
  providerStatus,
  onStatusChange,
}: SellerHomeProps) {
  const totalJobs = 156;
  const rating = 4.8;
  const completionRate = 98;
  // Mock user data for provider
  const user = { 
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');

  // Combine all jobs
  const allJobs = [...pendingRequests, ...upcomingJobs];
  
  // Filter jobs based on active tab
  const filteredJobs = activeTab === 'active' 
    ? allJobs.filter(job => job.status === 'in-progress' || job.status === 'confirmed')
    : allJobs.filter(job => job.status === activeTab);

  return (
    <div className="flex flex-col h-full bg-[#1B6BD4]">
      {/* Hero Section */}
      <div className="bg-[#1B6BD4] px-4 pt-6 pb-8 text-white relative overflow-hidden flex-shrink-0">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4 mb-6"
          >
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#408AF1]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold mb-1">
                Welcome Back, {user.name}! 👋
              </h1>
              <p className="text-white/90 text-sm">
                Service Provider
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-300" />
                </div>
              </div>
              <p className="text-2xl font-bold text-center">
                {pendingRequests.length}
              </p>
              <p className="text-xs text-white/80 text-center mt-1">
                Pending
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                </div>
              </div>
              <p className="text-2xl font-bold text-center">
                {upcomingJobs.length}
              </p>
              <p className="text-xs text-white/80 text-center mt-1">
                Active
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-300" />
                </div>
              </div>
              <p className="text-2xl font-bold text-center">
                {rating}
              </p>
              <p className="text-xs text-white/80 text-center mt-1">
                Rating
              </p>
            </motion.div>
          </div>

          {/* Performance Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <div>
                <p className="text-xs text-white/80">
                  Success Rate
                </p>
                <p className="font-semibold">
                  {completionRate}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-xs text-white/80">
                  Total Jobs
                </p>
                <p className="font-semibold">{totalJobs}</p>
              </div>
            </div>
          </motion.div>

          {/* Availability Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white/90" />
                <div>
                  <p className="font-medium text-sm">Availability Status</p>
                  <p className="text-xs text-white/70">
                    {providerStatus === 'active' ? 'Accepting new jobs' : 'Not accepting jobs'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStatusChange(providerStatus === 'active' ? 'offline' : 'active')}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  providerStatus === 'active' ? 'bg-green-400' : 'bg-white/30'
                }`}
              >
                <motion.div
                  animate={{
                    x: providerStatus === 'active' ? 28 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${
                    providerStatus === 'active' ? 'bg-white' : 'bg-gray-200'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 flex-shrink-0">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onManageServices}
            className="bg-white hover:bg-gray-50 p-4 rounded-2xl transition-all border border-gray-100 text-left shadow-sm"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">
              Services
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Coverage areas
            </p>
          </motion.button>

          {onManagePricing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onManagePricing}
              className="bg-white hover:bg-gray-50 p-4 rounded-2xl transition-all border border-gray-100 text-left shadow-sm"
            >
              <div className="w-10 h-10 bg-[#5DD9C1] rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-[#5DD9C1]/30">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                Pricing
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                See the rates
              </p>
            </motion.button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="py-4 pb-24 flex-shrink-0">
        {/* Status Tabs */}
        <div className="px-4">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === 'pending'
                  ? 'bg-[#003E93] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending ({allJobs.filter(j => j.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === 'active'
                  ? 'bg-[#003E93] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Active ({allJobs.filter(j => j.status === 'in-progress' || j.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === 'completed'
                  ? 'bg-[#003E93] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed ({allJobs.filter(j => j.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Filtered Jobs List */}
        <div className="px-4">
          {filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SellerJobCard
                    booking={job}
                    onSelect={() => onSelectJob(job.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-600 mb-1">
                No {activeTab} jobs
              </p>
              <p className="text-sm text-gray-500">
                {activeTab === 'pending' && 'New requests will appear here'}
                {activeTab === 'active' && 'Active jobs will appear here'}
                {activeTab === 'completed' && 'Completed jobs will appear here'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}