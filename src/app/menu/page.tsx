import { db } from "@/db";
import { categories, menuItems } from "@/db/schema";
import MenuPageClient from "./MenuPageClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.displayOrder);

  const allItems = await db
    .select()
    .from(menuItems)
    .orderBy(menuItems.name);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
          Our Menu
        </h1>
        <p className="text-ink/70 text-lg max-w-2xl mx-auto">
          From royal Pakistani delicacies to beloved fast food favorites —
          there&apos;s something for everyone.
        </p>
      </div>
      <MenuPageClient categories={allCategories} items={allItems} />
    </div>
  );
}
