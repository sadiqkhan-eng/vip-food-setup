import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { tableBookings, tables } from "@/db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status required" }, { status: 400 });
    }

    const updated = await db
      .update(tableBookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(tableBookings.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (status === "cancelled" || status === "completed") {
      await db
        .update(tables)
        .set({ isAvailable: true })
        .where(eq(tables.id, updated[0].tableId));
    }

    return NextResponse.json({ booking: updated[0] });
  } catch (error) {
    console.error("Booking PATCH error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
