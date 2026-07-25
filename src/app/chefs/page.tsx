import { db } from "@/db";
import { chefs } from "@/db/schema";
import ChefsPageClient from "./ChefsPageClient";

export const dynamic = "force-dynamic";

export default async function ChefsPage() {
  const allChefs = await db
    .select()
    .from(chefs)
    .orderBy(chefs.displayOrder);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
          Our Chefs
        </h1>
        <p className="text-ink/70 text-lg max-w-2xl mx-auto">
          Meet the talented chefs who bring authentic Pakistani flavors to your table
          with passion and expertise.
        </p>
      </div>
      <ChefsPageClient chefs={allChefs} />
    </div>
  );
}