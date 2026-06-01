import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: "partner" },
    select: { id: true, companyName: true, email: true, status: true, shareUrl: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id, status, shareUrl } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "필수 값이 누락되었습니다." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status, ...(shareUrl !== undefined ? { shareUrl } : {}) },
    select: { id: true, companyName: true, status: true, shareUrl: true },
  });

  return NextResponse.json(user);
}
