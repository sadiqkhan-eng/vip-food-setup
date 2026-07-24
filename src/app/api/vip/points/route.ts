import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { vipMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkUserId, points, orderTotal } = body;

    if (!clerkUserId || !points) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const member = await db
      .select()
      .from(vipMembers)
      .where(eq(vipMembers.clerkUserId, clerkUserId))
      .limit(1);

    if (member.length === 0) {
      return NextResponse.json({ error: "VIP member not found" }, { status: 404 });
    }

    const current = member[0];
    const newPoints = current.points + points;
    const newTotalSpent = parseFloat(current.totalSpent) + (orderTotal || 0);

    let newTier: "bronze" | "silver" | "gold" | "platinum" = "bronze";
    if (newPoints >= 5000) newTier = "platinum";
    else if (newPoints >= 2500) newTier = "gold";
    else if (newPoints >= 1000) newTier = "silver";

    const updated = await db
      .update(vipMembers)
      .set({
        points: newPoints,
        totalSpent: newTotalSpent.toString(),
        tier: newTier,
        updatedAt: new Date(),
      })
      .where(eq(vipMembers.clerkUserId, clerkUserId))
      .returning();

    return NextResponse.json({ member: updated[0] });
  } catch (error) {
    console.error("VIP Points POST error:", error);
    return NextResponse.json({ error: "Failed to add points" }, { status: 500 });
  }
}
