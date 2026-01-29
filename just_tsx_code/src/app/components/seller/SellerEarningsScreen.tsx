import { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Calendar, Award, ChevronRight, Download, Info } from 'lucide-react';
import { PaymentBreakdown } from '@/app/components/PaymentBreakdown';

interface Transaction {
  id: string;
  customerName: string;
  categoryName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
  bookingId: string;
}

export function SellerEarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [showEarningsBreakdown, setShowEarningsBreakdown] = useState(false);

  // Mock earnings data (gross amounts - what customers paid)
  const grossEarnings = {
    today: 500,
    week: 2600,
    month: 9911,
    total: 50667,
  };

  // Calculate net earnings (90% after Renizo 10% fee)
  const netEarnings = {
    today: grossEarnings.today * 0.90,
    week: grossEarnings.week * 0.90,
    month: grossEarnings.month * 0.90,
    total: grossEarnings.total * 0.90,
  };

  const stats = {
    completedJobs: 156,
    rating: 4.8,
    responseTime: '2 hrs',
    successRate: 98,
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      customerName: 'John Doe',
      categoryName: 'Residential Cleaning',
      amount: 150,
      date: 'Today, 2:00 PM',
      status: 'completed',
      bookingId: 'booking1',
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      categoryName: 'Lawn Care',
      amount: 200,
      date: 'Today, 10:00 AM',
      status: 'completed',
      bookingId: 'booking2',
    },
    {
      id: '3',
      customerName: 'Mike Williams',
      categoryName: 'Snow Removal',
      amount: 100,
      date: 'Yesterday, 4:30 PM',
      status: 'pending',
      bookingId: 'booking3',
    },
    {
      id: '4',
      customerName: 'Emily Davis',
      categoryName: 'Commercial Cleaning',
      amount: 80,
      date: 'Jan 15, 3:00 PM',
      status: 'completed',
      bookingId: 'booking4',
    },
    {
      id: '5',
      customerName: 'Robert Brown',
      categoryName: 'Moving Services',
      amount: 175,
      date: 'Jan 14, 11:00 AM',
      status: 'completed',
      bookingId: 'booking5',
    },
  ];

  const periods = [
    { id: 'today' as const, label: 'Today', amount: netEarnings.today },
    { id: 'week' as const, label: 'This Week', amount: netEarnings.week },
    { id: 'month' as const, label: 'This Month', amount: netEarnings.month },
    { id: 'all' as const, label: 'All Time', amount: netEarnings.total },
  ];

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="px-4 py-6 text-white">
        <h1 className="text-2xl mb-2">Earnings</h1>
        <p className="text-white/90">Track your revenue and performance</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6">
        {/* Period Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Your Net Earnings</h3>
          </div>

          {showEarningsBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-[#5DD9C1]/10 border border-[#5DD9C1]/30 rounded-2xl p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Net Earnings = Your Earnings After Fees</span>
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Renizo deducts a 10% service fee from each job. This fee covers platform maintenance and payment processing. You keep 90% of every job payment.
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`p-4 rounded-2xl text-left transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] text-white shadow-lg shadow-[#408AF1]/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className={`text-xs mb-1 ${
                  selectedPeriod === period.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {period.label}
                </p>
                <p className="text-2xl font-semibold">${period.amount.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-gray-900">Performance</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border-2 border-[#408AF1]/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedJobs}</p>
              <p className="text-xs text-gray-500 mt-1">Total Jobs</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-[#408AF1]/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stats.rating}</p>
              <p className="text-xs text-gray-500 mt-1">Average Score</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-[#408AF1]/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-gray-600">Response</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stats.responseTime}</p>
              <p className="text-xs text-gray-500 mt-1">Avg. Time</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-[#408AF1]/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-gray-600">Success</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stats.successRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Job Success</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-xs text-gray-500">Your net earnings</p>
          </div>

          <div className="space-y-2">
            {transactions.map((transaction, index) => {
              const netAmount = (transaction.amount * 0.90).toFixed(0); // Calculate provider's net amount
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.customerName}</h4>
                      <p className="text-sm text-gray-500">{transaction.categoryName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#5DD9C1]">+${netAmount}</p>
                      <p className="text-xs text-gray-400">of ${transaction.amount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Withdrawal Button */}
        <div>
          <button className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium shadow-lg shadow-[#408AF1]/30 flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5" />
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}