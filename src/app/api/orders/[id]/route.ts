import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, vipMembers } from "@/db/schema";
import { updateOrderStatusSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateOrderStatusSchema.parse(body);

    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (validatedData.status === "completed" && updatedOrder.clerkUserId) {
      const pointsEarned = Math.floor(parseFloat(updatedOrder.total) / 100);
      const member = await db
        .select()
        .from(vipMembers)
        .where(eq(vipMembers.clerkUserId, updatedOrder.clerkUserId))
        .limit(1);

      if (member.length > 0) {
        const current = member[0];
        const newPoints = current.points + pointsEarned;
        const newTotalSpent = parseFloat(current.totalSpent) + parseFloat(updatedOrder.total);
        let newTier: "bronze" | "silver" | "gold" | "platinum" = "bronze";
        if (newPoints >= 5000) newTier = "platinum";
        else if (newPoints >= 2500) newTier = "gold";
        else if (newPoints >= 1000) newTier = "silver";

        await db
          .update(vipMembers)
          .set({
            points: newPoints,
            totalSpent: newTotalSpent.toString(),
            tier: newTier,
            updatedAt: new Date(),
          })
          .where(eq(vipMembers.clerkUserId, updatedOrder.clerkUserId));
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
