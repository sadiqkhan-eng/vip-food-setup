"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    specialInstructions: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (orderType === "delivery" && !form.deliveryAddress) {
      setError("Delivery address is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          orderType,
          items: items.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-ink mb-4">
          Checkout
        </h1>
        <p className="text-ink/60 text-lg mb-8">
          Your cart is empty. Add some items first!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-parchment p-6 border border-gold/20">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Order Type
          </h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setOrderType("delivery")}
              className={`flex-1 rounded-full py-3 text-sm font-semibold transition-colors focus-ring ${
                orderType === "delivery"
                  ? "bg-maroon text-white"
                  : "bg-cream text-ink border border-gold/30 hover:bg-maroon/5"
              }`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setOrderType("pickup")}
              className={`flex-1 rounded-full py-3 text-sm font-semibold transition-colors focus-ring ${
                orderType === "pickup"
                  ? "bg-maroon text-white"
                  : "bg-cream text-ink border border-gold/30 hover:bg-maroon/5"
              }`}
            >
              Pickup
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-parchment p-6 border border-gold/20">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Your Details
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-ink mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="w-full rounded-full border border-gold/30 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                placeholder="Your name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-gold/30 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-gold/30 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </div>
            {orderType === "delivery" && (
              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  Delivery Address *
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  required={orderType === "delivery"}
                  rows={2}
                  className="w-full rounded-2xl border border-gold/30 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                  placeholder="Full delivery address"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="specialInstructions"
                className="block text-sm font-medium text-ink mb-1"
              >
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={form.specialInstructions}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-2xl border border-gold/30 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                placeholder="Any special requests..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-parchment p-6 border border-gold/20">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-ink">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/30 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Subtotal</span>
              <span className="font-medium text-ink">
                Rs. {total.toLocaleString()}
              </span>
            </div>
            {orderType === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-ink/70">Delivery Fee</span>
                <span className="font-medium text-ink">Rs. 200</span>
              </div>
            )}
            <div className="flex justify-between font-display text-lg font-bold">
              <span className="text-ink">Total</span>
              <span className="text-maroon">
                Rs. {(total + (orderType === "delivery" ? 200 : 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-maroon py-4 text-base font-semibold text-white transition-colors hover:bg-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

        <p className="text-center text-sm text-ink/50">
          Cash on {orderType === "delivery" ? "delivery" : "pickup"} — pay when
          you receive your order.
        </p>
      </form>
    </div>
  );
}
