import { ArrowLeft, Mail, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface HelpSupportScreenProps {
  onBack: () => void;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      category: 'Booking',
      question: 'How do I book a service?',
      answer: 'Browse available services in your town, select a provider, choose your preferred date and time, and complete the booking with in-app payment.',
    },
    {
      category: 'Booking',
      question: 'Can I cancel or reschedule a booking?',
      answer: 'Yes, you can cancel or reschedule bookings up to 24 hours before the scheduled time. Go to your bookings tab, select the booking, and choose "Cancel" or "Reschedule".',
    },
    {
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit and debit cards including Visa, Mastercard, and American Express. All payments are processed securely through our encrypted payment system.',
    },
    {
      category: 'Payment',
      question: 'Why should I pay through the app?',
      answer: 'Paying through the app provides secure payment processing, documented transactions, 30-day workmanship warranty, and protection for both customers and service providers.',
    },
    {
      category: 'Warranty',
      question: 'What is the 30-day warranty?',
      answer: 'All services booked and paid within Renizo include a free 30-day workmanship warranty. If you experience any issues with the service quality or workmanship within 30 days of completion, contact the provider through in-app chat to resolve the issue at no additional cost.',
    },
    {
      category: 'Warranty',
      question: 'How do I file a warranty claim?',
      answer: 'Contact the service provider through in-app chat within 30 days of service completion, describe the issue with photos if possible, and work with them to schedule a follow-up visit. If the issue remains unresolved, contact Renizo support for assistance.',
    },
    {
      category: 'Warranty',
      question: 'What does the warranty cover?',
      answer: 'The warranty covers defects in workmanship or service quality, issues directly related to the completed service, and follow-up repairs for warranty-valid issues. It does not cover normal wear and tear, damage from misuse, or issues reported after 30 days.',
    },
    {
      category: 'Account',
      question: 'How do I update my profile information?',
      answer: 'Go to Profile > Edit Profile to update your name, email, phone number, and profile photo.',
    },
    {
      category: 'Account',
      question: 'Can I change my town selection?',
      answer: 'Yes, tap the town name in the header or go to Profile > Change Town to switch between available towns.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const handleContactSupport = (method: string) => {
    toast.success(`Opening ${method}...`);
  };

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="font-semibold text-lg text-white">Help & Support</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3.5 bg-white text-black placeholder:text-gray-400 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase mb-3 px-1">Contact Us</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleContactSupport('Email')}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">Email Support</p>
                <p className="text-sm text-white/70">support@renizo.com</p>
              </div>
              <ExternalLink className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </motion.div>

        {/* FAQs by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase mb-3 px-1">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {categories.map((category, categoryIndex) => {
              const categoryFaqs = filteredFaqs.filter(faq => faq.category === category);
              if (categoryFaqs.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="font-semibold text-white mb-3">{category}</h3>
                  <div className="space-y-2">
                    {categoryFaqs.map((faq, index) => {
                      const globalIndex = faqs.indexOf(faq);
                      const isExpanded = expandedFaq === globalIndex;

                      return (
                        <motion.div
                          key={globalIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: categoryIndex * 0.05 + index * 0.03 }}
                          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : globalIndex)}
                            className="w-full p-4 flex items-start gap-3 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex-1 text-left">
                              <p className="font-medium text-white">{faq.question}</p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
                            )}
                          </button>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <p className="text-white/90 text-sm leading-relaxed">{faq.answer}</p>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/80">No results found for "{searchQuery}"</p>
              <p className="text-sm text-white/60 mt-2">Try searching with different keywords</p>
            </div>
          )}
        </motion.div>

        {/* Support Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
        >
          <h3 className="font-semibold mb-2 text-white">Support Hours</h3>
          <p className="text-sm text-white/90">
            <strong>Email:</strong> 24/7 (Response within 24 hours)
          </p>
        </motion.div>
      </div>
    </div>
  );
}