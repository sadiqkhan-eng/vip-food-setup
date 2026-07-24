"use client";

import { useState, useMemo } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/hooks/useCart";
import type { InferSelectModel } from "drizzle-orm";
import { categories, menuItems } from "@/db/schema";

interface CategoryPageProps {
  categories: InferSelectModel<typeof categories>[];
  items: InferSelectModel<typeof menuItems>[];
}

type SortOption = "name" | "price-low" | "price-high";

export default function MenuPageClient({
  categories,
  items,
}: CategoryPageProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name");
  const [showVegOnly, setShowVegOnly] = useState(false);
  const { itemCount, total } = useCart();

  const filteredItems = useMemo(() => {
    let result = items;

    if (activeCategory) {
      result = result.filter((item) => item.categoryId === activeCategory);
    }

    if (showVegOnly) {
      result = result.filter((item) => item.isVegetarian);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [items, activeCategory, search, sort, showVegOnly]);

  const itemCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    const base = showVegOnly ? items.filter((i) => i.isVegetarian) : items;
    for (const item of base) {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    }
    return counts;
  }, [items, showVegOnly]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, InferSelectModel<typeof menuItems>[]> = {};
    for (const item of filteredItems) {
      const catId = item.categoryId;
      if (!groups[catId]) groups[catId] = [];
      groups[catId].push(item);
    }
    return groups;
  }, [filteredItems]);

  const categoryOrder = useMemo(() => {
    const order = new Map<string, number>();
    categories.forEach((cat, i) => order.set(cat.id, i));
    return order;
  }, [categories]);

  const sortedCategoryIds = useMemo(() => {
    if (activeCategory) return [activeCategory];
    return Object.keys(groupedItems).sort(
      (a, b) => (categoryOrder.get(a) ?? 0) - (categoryOrder.get(b) ?? 0)
    );
  }, [activeCategory, groupedItems, categoryOrder]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
          Our Menu
        </h1>
        <p className="text-ink/70 text-lg max-w-2xl mx-auto">
          From royal Pakistani delicacies to beloved fast food favorites —
          there&apos;s something for everyone.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-sm border-b border-gold/20 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              placeholder="Search dishes..."
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

          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-gold/30 bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream appearance-none cursor-pointer"
            >
              <option value="name">A → Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              onClick={() => setShowVegOnly(!showVegOnly)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all focus-ring ${
                showVegOnly
                  ? "bg-green-600 text-white"
                  : "border border-gold/30 bg-white text-ink hover:bg-green-50"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 8.68-3.13 12-11" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 2s7 2 10 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Veg
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all focus-ring ${
              activeCategory === null
                ? "bg-maroon text-white shadow-md shadow-maroon/20"
                : "bg-white text-ink/70 border border-gold/20 hover:border-maroon/30 hover:text-ink"
            }`}
          >
            All
            <span className={`ml-1.5 text-xs ${activeCategory === null ? "text-white/70" : "text-ink/40"}`}>
              {showVegOnly
                ? items.filter((i) => i.isVegetarian).length
                : items.length}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all focus-ring ${
                activeCategory === cat.id
                  ? "bg-maroon text-white shadow-md shadow-maroon/20"
                  : "bg-white text-ink/70 border border-gold/20 hover:border-maroon/30 hover:text-ink"
              }`}
            >
              {cat.name}
              <span className={`ml-1.5 text-xs ${activeCategory === cat.id ? "text-white/70" : "text-ink/40"}`}>
                {itemCountByCategory[cat.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink/50">
          {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"} found
          {search && (
            <span className="ml-1">
              for &ldquo;<span className="text-ink font-medium">{search}</span>&rdquo;
            </span>
          )}
        </p>
      </div>

      {/* Category Sections */}
      {sortedCategoryIds.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-maroon/10 text-4xl">
            🔍
          </div>
          <p className="text-ink/60 text-lg font-medium mb-1">
            No dishes found
          </p>
          <p className="text-ink/40 text-sm mb-6">
            Try a different search or filter, or explore all categories.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory(null);
              setShowVegOnly(false);
            }}
            className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedCategoryIds.map((catId) => {
            const catName = categories.find((c) => c.id === catId)?.name ?? "Other";
            const catItems = groupedItems[catId];
            return (
              <section key={catId} className="pt-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-gold/30">
                  {catName}
                  <span className="ml-3 text-sm font-normal text-ink/50">
                    {catItems.length} {catItems.length === 1 ? "item" : "items"}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={parseFloat(item.price)}
                      isAvailable={item.isAvailable}
                      isSpicy={item.isSpicy}
                      isVegetarian={item.isVegetarian}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Floating Cart Summary */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <a
            href="/cart"
            className="flex items-center gap-4 rounded-full bg-maroon px-8 py-4 shadow-2xl shadow-maroon/40 transition-all hover:scale-105 hover:shadow-maroon/50"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="text-white font-semibold text-sm">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="h-5 w-px bg-white/30" />
            <span className="text-gold font-display font-bold text-base">
              Rs. {total.toLocaleString()}
            </span>
            <span className="rounded-full bg-gold text-maroon font-bold text-sm px-4 py-1.5 ml-1">
              View Cart
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
