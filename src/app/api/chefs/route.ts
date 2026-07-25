import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { chefs } from "@/db/schema";

const db = drizzle(neon(process.env.DATABASE_URL!));

export async function GET() {
  try {
    const allChefs = await db
      .select()
      .from(chefs)
      .orderBy(chefs.displayOrder);

    return NextResponse.json(allChefs);
  } catch (error) {
    console.error("Chefs GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chefs" },
      { status: 500 }
    );
  }
}