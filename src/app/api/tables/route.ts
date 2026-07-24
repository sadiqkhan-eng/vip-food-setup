import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { tables, tableBookings } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const partySize = searchParams.get("partySize");

    const allTables = await db.select().from(tables);

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await db
        .select()
        .from(tableBookings)
        .where(
          and(
            gte(tableBookings.bookingDate, startOfDay),
            lte(tableBookings.bookingDate, endOfDay),
            eq(tableBookings.status, "confirmed")
          )
        );

      const bookedTableIds = new Set(bookings.map((b) => b.tableId));

      const tablesWithAvailability = allTables.map((t) => ({
        ...t,
        isAvailable: t.isAvailable && !bookedTableIds.has(t.id),
      }));

      const filtered = partySize
        ? tablesWithAvailability.filter((t) => t.capacity >= parseInt(partySize))
        : tablesWithAvailability;

      return NextResponse.json({ tables: filtered });
    }

    return NextResponse.json({ tables: allTables });
  } catch (error) {
    console.error("Tables GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, clerkUserId, customerName, customerEmail, customerPhone, partySize, bookingDate, specialRequests } = body;

    if (!tableId || !customerName || !customerEmail || !customerPhone || !partySize || !bookingDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await db
      .insert(tableBookings)
      .values({
        tableId,
        clerkUserId: clerkUserId || null,
        customerName,
        customerEmail,
        customerPhone,
        partySize: parseInt(partySize),
        bookingDate: new Date(bookingDate),
        status: "confirmed",
        specialRequests: specialRequests || null,
      })
      .returning();

    return NextResponse.json({ booking: booking[0] }, { status: 201 });
  } catch (error) {
    console.error("Tables POST error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
