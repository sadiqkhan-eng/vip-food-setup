"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import TableFloorPlan from "@/components/TableFloorPlan";
import { useCart } from "@/hooks/useCart";

interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  isVipLounge: boolean;
  isAvailable: boolean;
  location: string;
}

export default function BookTablePage() {
  const { user } = useUser();
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    customerEmail: user?.emailAddresses?.[0]?.emailAddress || "",
    customerPhone: "",
    partySize: "2",
    bookingDate: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (form.bookingDate && form.partySize) {
      fetchTables();
    }
  }, [form.bookingDate, form.partySize]);

  async function fetchTables() {
    try {
      const res = await fetch(
        `/api/tables?date=${form.bookingDate}&partySize=${form.partySize}`
      );
      const data = await res.json();
      setTables(data.tables || []);
    } catch {
      setError("Failed to load tables");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTableId) {
      setError("Please select a table");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: selectedTableId,
          clerkUserId: user?.id || null,
          ...form,
          partySize: parseInt(form.partySize),
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      setSuccess(true);
    } catch {
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F7EEDD] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-[#C9992E] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">✓</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#6E1423] mb-2">
            Table Reserved!
          </h2>
          <p className="text-[#241A12]/60 mb-6">
            Your table has been booked successfully. We&apos;ll see you soon!
          </p>
          <Link href="/" className="inline-block rounded-full bg-[#6E1423] px-8 py-3 text-sm font-bold text-white hover:bg-[#8C1E30] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7EEDD] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#6E1423] mb-3">
            Reserve a <span className="text-[#C9992E] italic">Table</span>
          </h1>
          <p className="text-[#241A12]/60 text-lg">
            Choose your perfect spot — from cozy corners to the exclusive VIP Lounge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="font-display text-xl font-bold text-[#6E1423] mb-4">
              Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#241A12]/70 mb-1">Name</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full rounded-lg border border-[#241A12]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9992E] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#241A12]/70 mb-1">Email</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full rounded-lg border border-[#241A12]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9992E] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#241A12]/70 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="w-full rounded-lg border border-[#241A12]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9992E] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#241A12]/70 mb-1">Party Size</label>
                <select
                  value={form.partySize}
                  onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                  className="w-full rounded-lg border border-[#241A12]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9992E] focus:border-transparent"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#241A12]/70 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.bookingDate}
                  onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                  className="w-full rounded-lg border border-[#241A12]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9992E] focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#241A12]/70 mb-1">Special Requests</label>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  className="w-full rounded-lg border border-[#241A12]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9992E] focus:border-transparent"
                  rows={3}
                  placeholder="Birthday celebration, dietary needs, etc."
                />
              </div>
            </div>
          </div>

          {form.bookingDate && (
            <TableFloorPlan
              tables={tables}
              selectedTableId={selectedTableId}
              onSelectTable={setSelectedTableId}
              bookingDate={form.bookingDate}
            />
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading || !selectedTableId}
              className="rounded-full bg-[#C9992E] px-10 py-3.5 text-base font-bold text-[#6E1423] transition-all hover:bg-[#E3C878] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Reserving..." : "Reserve Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
