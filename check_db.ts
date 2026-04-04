
import { getDb } from "./server/db";
import { wilborUsers } from "./drizzle/schema";

async function main() {
  const db = await getDb();
  if (db) {
    const users = await db.select().from(wilborUsers);
    console.log("USERS_START");
    console.log(JSON.stringify(users, null, 2));
    console.log("USERS_END");
  } else {
    console.log("DB not available");
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
