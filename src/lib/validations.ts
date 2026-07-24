import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  orderType: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "At least one item is required"),
});

export const createReservationSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  partySize: z.number().int().min(1).max(20, "Maximum party size is 20"),
  reservationDate: z.string().datetime(),
  specialRequests: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "completed",
    "cancelled",
  ]),
});

export const updateReservationStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "seated",
    "completed",
    "cancelled",
    "no_show",
  ]),
});
