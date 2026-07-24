"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReservePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    partySize: 2,
    reservationDate: "",
    reservationTime: "",
    specialRequests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const dateTime = `${form.reservationDate}T${form.reservationTime}:00`;
    const reservationDate = new Date(dateTime);

    if (reservationDate <= new Date()) {
      setError("Please select a future date and time");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          partySize: parseInt(form.partySize.toString()),
          reservationDate: reservationDate.toISOString(),
          specialRequests: form.specialRequests || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rounded-2xl bg-green-50 border border-green-200 p-8 max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold text-ink mb-4">
            Reservation Confirmed!
          </h1>
          <p className="text-ink/70 mb-2">
            We&apos;ll send a confirmation to your email shortly.
          </p>
          <p className="text-ink/50 text-sm mb-8">
            Please arrive 10 minutes before your reservation time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/menu"
              className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
            >
              View Menu
            </Link>
            <Link
              href="/"
              className="rounded-full border border-gold/40 px-6 py-2.5 text-sm font-semibold text-ink/60 transition-colors hover:bg-maroon/5 focus-ring"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
          Reserve a Table
        </h1>
        <p className="text-ink/70 text-lg">
          Book your table for a royal dining experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>
        </div>

        <div className="rounded-2xl bg-parchment p-6 border border-gold/20">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Reservation Details
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="partySize"
                className="block text-sm font-medium text-ink mb-1"
              >
                Party Size *
              </label>
              <select
                id="partySize"
                name="partySize"
                value={form.partySize}
                onChange={handleChange}
                required
                className="w-full rounded-full border border-gold/30 bg-cream px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reservationDate"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  Date *
                </label>
                <input
                  type="date"
                  id="reservationDate"
                  name="reservationDate"
                  value={form.reservationDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-full border border-gold/30 bg-cream px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                />
              </div>
              <div>
                <label
                  htmlFor="reservationTime"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  Time *
                </label>
                <input
                  type="time"
                  id="reservationTime"
                  name="reservationTime"
                  value={form.reservationTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-gold/30 bg-cream px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="specialRequests"
                className="block text-sm font-medium text-ink mb-1"
              >
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-2xl border border-gold/30 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-parchment"
                placeholder="Birthday celebration, high chair needed, etc."
              />
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
          {loading ? "Booking..." : "Reserve a Table"}
        </button>
      </form>
    </div>
  );
}
