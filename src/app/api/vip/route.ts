import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { vipMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get("clerkUserId");

    if (!clerkUserId) {
      return NextResponse.json({ error: "clerkUserId required" }, { status: 400 });
    }

    const member = await db
      .select()
      .from(vipMembers)
      .where(eq(vipMembers.clerkUserId, clerkUserId))
      .limit(1);

    if (member.length === 0) {
      return NextResponse.json({ member: null });
    }

    return NextResponse.json({ member: member[0] });
  } catch (error) {
    console.error("VIP GET error:", error);
    return NextResponse.json({ error: "Failed to fetch VIP data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkUserId, customerName, customerEmail } = body;

    if (!clerkUserId || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(vipMembers)
      .where(eq(vipMembers.clerkUserId, clerkUserId))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ member: existing[0] });
    }

    const newMember = await db
      .insert(vipMembers)
      .values({
        clerkUserId,
        tier: "bronze",
        points: 0,
        totalSpent: "0",
      })
      .returning();

    return NextResponse.json({ member: newMember[0] }, { status: 201 });
  } catch (error) {
    console.error("VIP POST error:", error);
    return NextResponse.json({ error: "Failed to create VIP member" }, { status: 500 });
  }
}
