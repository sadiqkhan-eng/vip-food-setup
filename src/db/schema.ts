import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "completed",
  "cancelled",
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "seated",
  "completed",
  "cancelled",
  "no_show",
]);

export const orderTypeEnum = pgEnum("order_type", ["delivery", "pickup"]);

export const vipTierEnum = pgEnum("vip_tier", [
  "bronze",
  "silver",
  "gold",
  "platinum",
]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  isSpicy: boolean("is_spicy").default(false).notNull(),
  isVegetarian: boolean("is_vegetarian").default(false).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  orderType: orderTypeEnum("order_type").notNull(),
  deliveryAddress: text("delivery_address"),
  status: orderStatusEnum("status").default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItems.id),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  itemPrice: decimal("item_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  partySize: integer("party_size").notNull(),
  reservationDate: timestamp("reservation_date").notNull(),
  status: reservationStatusEnum("status").default("pending").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vipMembers = pgTable("vip_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  tier: vipTierEnum("tier").default("bronze").notNull(),
  points: integer("points").default(0).notNull(),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  memberSince: timestamp("member_since").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tables = pgTable("tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableNumber: varchar("table_number", { length: 50 }).notNull().unique(),
  capacity: integer("capacity").notNull(),
  isVipLounge: boolean("is_vip_lounge").default(false).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  location: varchar("location", { length: 100 }).default("main").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tableBookings = pgTable("table_bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableId: uuid("table_id")
    .notNull()
    .references(() => tables.id),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  partySize: integer("party_size").notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  duration: integer("duration").default(120).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
