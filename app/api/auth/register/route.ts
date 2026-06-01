import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { companyName, email, password } = await req.json();

    if (!companyName || !email || !password) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { companyName }] },
    });

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
      }
      return NextResponse.json({ error: "이미 등록된 협력사명입니다." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { companyName, email, password: hashed, role: "partner", status: "pending" },
    });

    return NextResponse.json({ message: "가입 신청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
