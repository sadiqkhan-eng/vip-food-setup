"use client";

import { useState, useMemo } from "react";
import ChefCard from "@/components/ChefCard";
import type { InferSelectModel } from "drizzle-orm";
import { chefs } from "@/db/schema";

interface ChefsPageProps {
  chefs: InferSelectModel<typeof chefs>[];
}

export default function ChefsPageClient({ chefs }: ChefsPageProps) {
  const [search, setSearch] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredChefs = useMemo(() => {
    let result = chefs;

    if (showAvailableOnly) {
      result = result.filter((chef) => chef.isAvailable);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (chef) =>
          chef.name.toLowerCase().includes(q) ||
          chef.role.toLowerCase().includes(q) ||
          chef.bio?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [chefs, search, showAvailableOnly]);

  return (
    <div>
      <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-sm border-b border-gold/20 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search chefs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gold/30 bg-white pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream transition-shadow"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all focus-ring ${
              showAvailableOnly
                ? "bg-maroon text-white"
                : "border border-gold/30 bg-white text-ink hover:bg-maroon/5"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Available Only
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink/50">
          {filteredChefs.length} {filteredChefs.length === 1 ? "chef" : "chefs"} found
          {search && (
            <span className="ml-1">
              for &ldquo;<span className="text-ink font-medium">{search}</span>&rdquo;
            </span>
          )}
        </p>
      </div>

      {filteredChefs.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-maroon/10 text-4xl">
            🔍
          </div>
          <p className="text-ink/60 text-lg font-medium mb-1">
            No chefs found
          </p>
          <p className="text-ink/40 text-sm mb-6">
            Try a different search or filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setShowAvailableOnly(false);
            }}
            className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChefs.map((chef) => (
            <ChefCard
              key={chef.id}
              name={chef.name}
              role={chef.role}
              bio={chef.bio}
              imageUrl={chef.imageUrl}
              isAvailable={chef.isAvailable}
            />
          ))}
        </div>
      )}
    </div>
  );
}