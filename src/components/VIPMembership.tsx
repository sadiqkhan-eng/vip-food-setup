"use client";

interface VIPMembershipProps {
  tier: string;
  points: number;
  totalSpent: string;
  memberSince: string;
}

const tierConfig: Record<string, { color: string; gradient: string; next: string | null; max: number }> = {
  bronze: { color: "#CD7F32", gradient: "from-[#CD7F32]/20 to-[#8B5E3C]/10", next: "Silver", max: 1000 },
  silver: { color: "#C0C0C0", gradient: "from-[#C0C0C0]/20 to-[#A8A8A8]/10", next: "Gold", max: 2500 },
  gold: { color: "#C9992E", gradient: "from-[#C9992E]/20 to-[#9C7620]/10", next: "Platinum", max: 5000 },
  platinum: { color: "#E5E4E2", gradient: "from-[#E5E4E2]/20 to-[#B0B0B0]/10", next: null, max: 5000 },
};

const tierBenefits: Record<string, string[]> = {
  bronze: ["1x points on every order", "Free delivery on orders over Rs. 2,000", "Birthday special discount"],
  silver: ["1.5x points on every order", "Free delivery on all orders", "5% discount on all items", "Priority customer support"],
  gold: ["2x points on every order", "Free delivery on all orders", "10% discount on all items", "Priority customer support", "Exclusive seasonal menu"],
  platinum: ["3x points on every order", "Free delivery on all orders", "15% discount on all items", "Priority customer support", "Exclusive seasonal menu", "VIP lounge access", "Personal chef consultation"],
};

export default function VIPMembership({ tier, points, totalSpent, memberSince }: VIPMembershipProps) {
  const config = tierConfig[tier] || tierConfig.bronze;
  const benefits = tierBenefits[tier] || tierBenefits.bronze;
  const progress = config.next ? Math.min((points / config.max) * 100, 100) : 100;

  return (
    <div className={`rounded-2xl border border-[${config.color}]/30 overflow-hidden bg-gradient-to-br ${config.gradient}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: config.color }}
            >
              {tier.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#241A12]/50 font-semibold">VIP Member</p>
              <p className="text-xl font-display font-bold text-[#6E1423] capitalize">{tier}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-bold" style={{ color: config.color }}>
              {points.toLocaleString()}
            </p>
            <p className="text-xs text-[#241A12]/50">Points</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-[#241A12]/10">
          <div className="text-center">
            <p className="text-sm font-bold text-[#6E1423]">{points.toLocaleString()}</p>
            <p className="text-xs text-[#241A12]/50">Points</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#6E1423]">Rs. {parseFloat(totalSpent).toLocaleString()}</p>
            <p className="text-xs text-[#241A12]/50">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#6E1423]">{memberSince}</p>
            <p className="text-xs text-[#241A12]/50">Member Since</p>
          </div>
        </div>

        {config.next && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#241A12]/60">{points.toLocaleString()} pts</span>
              <span className="text-[#241A12]/60">{config.max.toLocaleString()} pts to {config.next}</span>
            </div>
            <div className="h-2 bg-[#241A12]/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: config.color }}
              />
            </div>
          </div>
        )}

        {config.next === null && (
          <div className="mb-6 text-center py-2 bg-[#C9992E]/10 rounded-lg">
            <p className="text-sm font-semibold text-[#C9992E]">You've reached the highest tier!</p>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-[#6E1423] mb-3">Your Benefits</p>
          <ul className="space-y-2">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-[#241A12]/70">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: config.color }}>
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
