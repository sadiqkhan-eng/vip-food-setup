CREATE TABLE "vip_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"tier" "vip_tier" DEFAULT 'bronze' NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"total_spent" numeric(10, 2) DEFAULT '0' NOT NULL,
	"member_since" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vip_members_clerk_user_id_unique" UNIQUE("clerk_user_id")
);--> statement-breakpoint
CREATE TABLE "tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_number" varchar(50) NOT NULL,
	"capacity" integer NOT NULL,
	"is_vip_lounge" boolean DEFAULT false NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"location" varchar(100) DEFAULT 'main' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tables_table_number_unique" UNIQUE("table_number")
);--> statement-breakpoint
CREATE TABLE "table_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid NOT NULL,
	"clerk_user_id" varchar(255),
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"party_size" integer NOT NULL,
	"booking_date" timestamp NOT NULL,
	"duration" integer DEFAULT 120 NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"special_requests" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "table_bookings" ADD CONSTRAINT "table_bookings_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;
