/**
 * Milestone Seed Script
 * Seeds the database with complete milestone data (0-24 months)
 *
 * Imports from central source: server/_core/milestonesData.ts
 * This ensures single source of truth for all milestone content.
 */

import { getDb } from "../server/db";
import { wilborMilestoneContent } from "./schema";
import { COMPLETE_MILESTONES } from "../server/_core/milestonesData";

async function seed() {
  console.log("🌱 Starting complete milestone seed...");
  console.log(`📊 Total milestones to insert: ${COMPLETE_MILESTONES.length}`);

  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
  }

  try {
    // First, clear existing milestones to avoid duplicates
    console.log("🗑️ Clearing existing milestones...");
    await db.delete(wilborMilestoneContent);

    // Insert all milestones from central source
    await db.insert(wilborMilestoneContent).values(COMPLETE_MILESTONES as any);
    console.log(`✅ Successfully inserted ${COMPLETE_MILESTONES.length} milestones!`);

    // Group by month for verification
    const byMonth: Record<number, number> = {};
    COMPLETE_MILESTONES.forEach((m: any) => {
      byMonth[m.month] = (byMonth[m.month] || 0) + 1;
    });

    console.log("\n📅 Milestones by month:");
    Object.entries(byMonth)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([month, count]) => {
        console.log(`  Mês ${month}: ${count} marcos`);
      });

  } catch (error) {
    console.error("❌ Error seeding milestones:", error);
    process.exit(1);
  }
}

seed();
