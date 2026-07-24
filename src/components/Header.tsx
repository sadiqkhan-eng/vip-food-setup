"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useUser, useClerk } from "@clerk/nextjs";
import Seal from "./Seal";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/book-table", label: "Book Table" },
  { href: "/reserve", label: "Reserve" },
];

const authLinks = [
  { href: "/account", label: "My Account" },
  { href: "/orders", label: "My Orders" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="sticky top-0 z-50 bg-maroon text-white shadow-lg shadow-maroon/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Seal size={34} className="text-gold" />
            <span className="font-display text-xl font-bold tracking-wide">
              VIP Setup
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}
            {isSignedIn &&
              authLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gold" />
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-maroon transition-all hover:bg-gold-light hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white px-1 ring-2 ring-gold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth button / User menu */}
            {isSignedIn ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition-all hover:bg-white/20 focus-ring"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-maroon text-xs font-bold">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user?.firstName || "Account"}
                  </span>
                  <svg className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white text-ink shadow-xl border border-gold/20 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gold/10">
                        <p className="text-sm font-semibold text-ink truncate">{user?.fullName || user?.emailAddresses?.[0]?.emailAddress}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {isAdmin && (
                            <span className="inline-flex items-center rounded-full bg-maroon/10 px-2 py-0.5 text-[10px] font-bold text-maroon uppercase">
                              Admin
                            </span>
                          )}
                          <span className="text-xs text-ink/50">
                            {user?.emailAddresses?.[0]?.emailAddress}
                          </span>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-cream transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Account
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-cream transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-maroon font-medium hover:bg-maroon/5 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gold/10 py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut();
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="rounded-full border border-gold/60 px-5 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-maroon transition-all hover:bg-gold-light"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 bg-maroon-dark">
          <div className="px-4 py-4 space-y-1">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-gold" />}
                </Link>
              );
            })}

            {isSignedIn && (
              <>
                <div className="pt-2 pb-1 px-4">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                    Account
                  </p>
                </div>
                {authLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-gold" />}
                    </Link>
                  );
                })}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gold hover:bg-white/10 transition-colors"
                  >
                    <span>Admin Dashboard</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                )}
              </>
            )}

            <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
              {isSignedIn ? (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-maroon"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    View Cart {itemCount > 0 && `(${itemCount})`}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-gold/60 px-4 py-3 text-sm font-semibold text-gold hover:bg-gold/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-bold text-maroon"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
