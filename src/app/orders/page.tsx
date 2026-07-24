"use client";

import { useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderType: string;
  status: string;
  subtotal: string;
  total: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const allOrders = await res.json();
        const filtered = allOrders.filter(
          (o: Order) => o.customerEmail.toLowerCase() === email.toLowerCase()
        );
        setOrders(filtered);
        setSearched(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
          My Orders
        </h1>
        <p className="text-ink/70 text-lg">
          Enter your email to view your order history.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-full border border-gold/30 bg-white pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-maroon px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-maroon-dark disabled:opacity-50 focus-ring"
          >
            {loading ? "Searching..." : "Find Orders"}
          </button>
        </div>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-maroon/10 text-3xl">
            📦
          </div>
          <p className="text-ink/60 text-lg font-medium mb-1">
            No orders found
          </p>
          <p className="text-ink/40 text-sm mb-6">
            We couldn&apos;t find any orders for this email. Try a different email or place a new order.
          </p>
          <Link
            href="/menu"
            className="inline-block rounded-full bg-maroon px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
          >
            Browse Menu
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-parchment p-6 border border-gold/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs text-ink/50 mb-1">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-ink/60">
                    {order.orderType === "delivery" ? "Delivery" : "Pickup"} &middot;{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-maroon">
                    Rs. {parseFloat(order.total).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold mt-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
