import { motion } from "motion/react";
import { Star, TrendingUp } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({
  userName,
}: WelcomeBannerProps) {
  const greeting = userName
    ? `Welcome Back, ${userName.split(" ")[0]}!`
    : "Welcome Back!";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-4 mb-2 bg-[#003E93] rounded-3xl p-6 text-white shadow-lg border border-white/20"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl mb-1">{greeting}</h3>
          <p className="text-white/90 text-sm">
            Ready to book your next service?
          </p>
        </div>
        <div className="bg-white/20 rounded-full p-2">
          <Star className="w-5 h-5 fill-white" />
        </div>
      </div>
    </motion.div>
  );
}