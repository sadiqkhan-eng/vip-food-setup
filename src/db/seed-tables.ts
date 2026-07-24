import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { tables } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding tables...");

  const tableData = [
    { tableNumber: "T1", capacity: 2, isVipLounge: false, location: "main hall" },
    { tableNumber: "T2", capacity: 2, isVipLounge: false, location: "main hall" },
    { tableNumber: "T3", capacity: 2, isVipLounge: false, location: "main hall" },
    { tableNumber: "T4", capacity: 4, isVipLounge: false, location: "main hall" },
    { tableNumber: "T5", capacity: 4, isVipLounge: false, location: "main hall" },
    { tableNumber: "T6", capacity: 4, isVipLounge: false, location: "main hall" },
    { tableNumber: "T7", capacity: 6, isVipLounge: false, location: "main hall" },
    { tableNumber: "T8", capacity: 6, isVipLounge: false, location: "main hall" },
    { tableNumber: "T9", capacity: 4, isVipLounge: true, location: "VIP lounge" },
    { tableNumber: "T10", capacity: 4, isVipLounge: true, location: "VIP lounge" },
    { tableNumber: "T11", capacity: 8, isVipLounge: true, location: "VIP lounge" },
    { tableNumber: "T12", capacity: 10, isVipLounge: true, location: "VIP lounge" },
  ];

  const inserted = await db.insert(tables).values(tableData).returning();

  console.log("Tables seeded successfully!");
  console.log(`Inserted ${inserted.length} tables`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
