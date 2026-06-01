import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// One-time seed endpoint to create admin account
export async function POST() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sk-stoa.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    return NextResponse.json({ message: "Admin already exists" });
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

  return NextResponse.json({ message: "Admin created successfully" });
}
