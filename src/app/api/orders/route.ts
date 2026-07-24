import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, menuItems } from "@/db/schema";
import { createOrderSchema } from "@/lib/validations";
import { inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    if (
      validatedData.orderType === "delivery" &&
      !validatedData.deliveryAddress
    ) {
      return NextResponse.json(
        { error: "Delivery address is required for delivery orders" },
        { status: 400 }
      );
    }

    const itemIds = validatedData.items.map((i) => i.menuItemId);
    const dbItems = await db
      .select()
      .from(menuItems)
      .where(inArray(menuItems.id, itemIds));

    if (dbItems.length !== itemIds.length) {
      return NextResponse.json(
        { error: "One or more menu items not found" },
        { status: 400 }
      );
    }

    const unavailableItems = dbItems.filter((item) => !item.isAvailable);
    if (unavailableItems.length > 0) {
      return NextResponse.json(
        {
          error: "Some items are unavailable",
          items: unavailableItems.map((i) => i.name),
        },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderItemsData: {
      menuItemId: string;
      itemName: string;
      itemPrice: string;
      quantity: number;
    }[] = [];

    for (const item of validatedData.items) {
      const dbItem = dbItems.find((i) => i.id === item.menuItemId);
      if (!dbItem) continue;

      const price = parseFloat(dbItem.price);
      subtotal += price * item.quantity;

      orderItemsData.push({
        menuItemId: dbItem.id,
        itemName: dbItem.name,
        itemPrice: dbItem.price,
        quantity: item.quantity,
      });
    }

    const deliveryFee =
      validatedData.orderType === "delivery" ? 200 : 0;
    const total = subtotal + deliveryFee;

    const [newOrder] = await db
      .insert(orders)
      .values({
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        orderType: validatedData.orderType,
        deliveryAddress: validatedData.deliveryAddress,
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
        specialInstructions: validatedData.specialInstructions,
      })
      .returning();

    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      orderId: newOrder.id,
    }));

    await db.insert(orderItems).values(itemsWithOrderId);

    return NextResponse.json(
      {
        orderId: newOrder.id,
        total,
        message: "Order placed successfully",
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
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(orders.createdAt);

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
