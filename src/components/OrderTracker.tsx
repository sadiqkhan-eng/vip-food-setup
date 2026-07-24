"use client";

import { useState, useEffect } from "react";

interface OrderTrackerProps {
  orderId: string;
  currentStatus: string;
  orderType: string;
}

const deliverySteps = [
  { key: "pending", label: "Order Placed", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "out_for_delivery", label: "On the Way", icon: "🚗" },
  { key: "completed", label: "Delivered", icon: "🎉" },
];

const pickupSteps = [
  { key: "pending", label: "Order Placed", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "completed", label: "Ready", icon: "🎉" },
];

const statusMessages: Record<string, string> = {
  pending: "Your order has been received and is waiting to be confirmed.",
  confirmed: "Great news! Your order has been confirmed by the kitchen.",
  preparing: "Our chefs are preparing your food with love and care.",
  out_for_delivery: "Your order is on its way to you right now!",
  completed: "Your order has been delivered. Enjoy your meal!",
  cancelled: "This order has been cancelled.",
};

export default function OrderTracker({ orderId, currentStatus, orderType }: OrderTrackerProps) {
  const [status, setStatus] = useState(currentStatus);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const steps = orderType === "pickup" ? pickupSteps : deliverySteps;
  const currentIndex = steps.findIndex((s) => s.key === status);

  useEffect(() => {
    if (status === "completed" || status === "cancelled") return;

    const interval = setInterval(() => {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.status !== status) {
            setStatus(data.status);
            setLastUpdated(new Date());
          }
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [orderId, status]);

  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#C9992E]/20">
      <h3 className="font-display text-xl font-bold text-[#6E1423] mb-1">
        Order Tracking
      </h3>
      <p className="text-sm text-[#241A12]/50 mb-6">
        Order #{orderId.slice(0, 8).toUpperCase()}
      </p>

      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#C9992E] z-[1] transition-all duration-700"
          style={{
            width: `${currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-[2]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                  isCompleted
                    ? "bg-[#C9992E] text-white shadow-md"
                    : "bg-gray-100 text-gray-400"
                } ${isCurrent ? "ring-4 ring-[#C9992E]/30 scale-110" : ""}`}
              >
                {step.icon}
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center max-w-[70px] ${
                  isCompleted ? "text-[#6E1423]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-[#F7EEDD] rounded-xl p-4 text-center">
        <p className="text-[#6E1423] font-medium text-sm">
          {statusMessages[status] || "Processing your order..."}
        </p>
      </div>

      {status !== "completed" && status !== "cancelled" && (
        <p className="text-xs text-[#241A12]/40 text-center mt-3">
          Last updated: {minutesAgo === 0 ? "Just now" : `${minutesAgo} min ago`} • Refreshes every 30s
        </p>
      )}
    </div>
  );
}
