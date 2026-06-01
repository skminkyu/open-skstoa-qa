import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    if (user.role === "partner" && user.status === "pending") {
      return NextResponse.json({ error: "관리자 승인 대기 중입니다. 승인 후 로그인 가능합니다." }, { status: 403 });
    }

    if (user.role === "partner" && user.status === "rejected") {
      return NextResponse.json({ error: "가입 신청이 거절되었습니다. 관리자에게 문의하세요." }, { status: 403 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
      status: user.status,
    });

    const response = NextResponse.json({
      message: "로그인 성공",
      user: { companyName: user.companyName, role: user.role },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
