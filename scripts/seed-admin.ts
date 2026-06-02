import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL ?? `file:${path.resolve(process.cwd(), "dev.db")}`;
const dbPath = dbUrl.replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sk-stoa.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin already exists:", adminEmail);
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 12);
  await prisma.user.create({
    data: {
      companyName: "SK스토아 관리자",
      email: adminEmail,
      password: hashed,
      role: "admin",
      status: "approved",
    },
  });
  console.log("Admin created:", adminEmail);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
