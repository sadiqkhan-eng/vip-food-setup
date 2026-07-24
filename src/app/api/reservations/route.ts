import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { createReservationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createReservationSchema.parse(body);

    const [newReservation] = await db
      .insert(reservations)
      .values({
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        partySize: validatedData.partySize,
        reservationDate: new Date(validatedData.reservationDate),
        specialRequests: validatedData.specialRequests,
      })
      .returning();

    return NextResponse.json(
      {
        reservationId: newReservation.id,
        message: "Reservation created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Reservation creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allReservations = await db
      .select()
      .from(reservations)
      .orderBy(reservations.reservationDate);

    return NextResponse.json(allReservations);
  } catch (error) {
    console.error("Fetch reservations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
