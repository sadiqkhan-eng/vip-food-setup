"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-ink mb-4">
          Your Cart
        </h1>
        <p className="text-ink/60 text-lg mb-2">
          Your cart is empty.
        </p>
        <p className="text-ink/40 text-sm mb-8">
          Browse our menu and add your favorites!
        </p>
        <Link
          href="/menu"
          className="inline-block rounded-full bg-maroon px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        Your Cart
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl bg-parchment p-5 border border-gold/20"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-ink truncate">
                {item.name}
              </h3>
              <p className="text-sm text-ink/60">
                Rs. {item.price.toLocaleString()} each
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-full bg-maroon/10 text-maroon font-bold flex items-center justify-center hover:bg-maroon/20 focus-ring"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-ink">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-full bg-maroon/10 text-maroon font-bold flex items-center justify-center hover:bg-maroon/20 focus-ring"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right font-display font-bold text-maroon">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="text-ink/40 hover:text-red-500 transition-colors focus-ring rounded p-1"
                aria-label={`Remove ${item.name}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-parchment p-6 border border-gold/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-ink/70">Subtotal</span>
          <span className="font-display text-lg font-bold text-ink">
            Rs. {total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-6 text-sm text-ink/50">
          <span>Delivery fee calculated at checkout</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 rounded-full bg-maroon py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={clearCart}
            className="rounded-full border border-gold/40 px-6 py-3.5 text-sm font-semibold text-ink/60 transition-colors hover:bg-maroon/5 focus-ring"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
