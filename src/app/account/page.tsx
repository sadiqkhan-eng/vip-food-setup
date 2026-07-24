"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import VIPMembership from "@/components/VIPMembership";

export default function AccountPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [vipData, setVipData] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/vip?clerkUserId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.member) {
            setVipData(data.member);
          } else {
            fetch("/api/vip", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                clerkUserId: user.id,
                customerName: user.fullName || "",
                customerEmail: user.emailAddresses?.[0]?.emailAddress || "",
              }),
            })
              .then((res) => res.json())
              .then((data) => setVipData(data.member));
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-ink/60 mb-4">Loading account...</p>
        </div>
      </div>
    );
  }

  const role = (user.publicMetadata?.role as string) || "customer";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-maroon text-gold text-3xl font-display font-bold shadow-lg shadow-maroon/20">
          {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "?"}
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-1">
          {user.fullName || user.firstName || "My Account"}
        </h1>
        <p className="text-ink/50 text-sm">{user.emailAddresses[0]?.emailAddress}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            role === "admin"
              ? "bg-maroon/10 text-maroon"
              : "bg-gold/10 text-gold-dark"
          }`}>
            {role === "admin" ? "👑 Admin" : "🍽️ VIP Member"}
          </span>
          <span className="text-ink/30 text-xs">·</span>
          <span className="text-ink/40 text-xs">Member since {memberSince}</span>
        </div>
      </div>

      {vipData && (
        <div className="mb-10">
          <VIPMembership
            tier={vipData.tier}
            points={vipData.points}
            totalSpent={vipData.totalSpent}
            memberSince={memberSince}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <Link
          href="/orders"
          className="group rounded-2xl bg-parchment border border-gold/20 p-6 text-center transition-all hover:shadow-lg hover:border-gold/40 hover:-translate-y-0.5"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon/10 text-maroon group-hover:bg-maroon/15 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-ink mb-1">My Orders</h3>
          <p className="text-xs text-ink/50">Track and reorder</p>
        </Link>

        <Link
          href="/book-table"
          className="group rounded-2xl bg-parchment border border-gold/20 p-6 text-center transition-all hover:shadow-lg hover:border-gold/40 hover:-translate-y-0.5"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-dark group-hover:bg-gold/15 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-ink mb-1">Book Table</h3>
          <p className="text-xs text-ink/50">VIP Lounge available</p>
        </Link>

        <Link
          href="/reserve"
          className="group rounded-2xl bg-parchment border border-gold/20 p-6 text-center transition-all hover:shadow-lg hover:border-gold/40 hover:-translate-y-0.5"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-dark group-hover:bg-gold/15 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-ink mb-1">Events</h3>
          <p className="text-xs text-ink/50">Private events</p>
        </Link>

        <Link
          href="/menu"
          className="group rounded-2xl bg-parchment border border-gold/20 p-6 text-center transition-all hover:shadow-lg hover:border-gold/40 hover:-translate-y-0.5"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 group-hover:bg-green-50 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-ink mb-1">Full Menu</h3>
          <p className="text-xs text-ink/50">Browse all dishes</p>
        </Link>
      </div>

      <div className="rounded-2xl bg-parchment border border-gold/20 p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-ink mb-6">
          Account Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
              Full Name
            </label>
            <p className="text-ink font-medium">{user.fullName || "Not set"}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <p className="text-ink font-medium">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
              Phone
            </label>
            <p className="text-ink font-medium">{user.phoneNumbers?.[0]?.phoneNumber || "Not set"}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
              Account Type
            </label>
            <p className="text-ink font-medium capitalize">{role}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/20">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-ring"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
