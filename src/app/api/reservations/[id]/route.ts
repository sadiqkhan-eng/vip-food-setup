import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { updateReservationStatusSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateReservationStatusSchema.parse(body);

    const [updatedReservation] = await db
      .update(reservations)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, id))
      .returning();

    if (!updatedReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedReservation);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Update reservation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
