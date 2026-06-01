import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { companyName: true, status: true, shareUrl: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e63329" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">SK스토아 QA 파트너 포털</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.companyName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">QA 진척 현황</h1>
          <p className="text-gray-500 text-sm mt-1">{user.companyName} 상품의 QA 진행 현황입니다.</p>
        </div>

        {user.status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-yellow-800 mb-2">승인 대기 중</h2>
            <p className="text-yellow-700 text-sm">관리자 승인 후 QA 진척 현황을 확인하실 수 있습니다.<br />영업일 기준 1~2일 내에 처리됩니다.</p>
          </div>
        )}

        {user.status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-red-800 mb-2">가입 신청 거절</h2>
            <p className="text-red-700 text-sm">가입 신청이 거절되었습니다.<br />문의 사항은 SK스토아 QA 가이드 카카오톡 채널로 연락해주세요.</p>
          </div>
        )}

        {user.status === "approved" && !user.shareUrl && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-blue-800 mb-2">QA 현황 준비 중</h2>
            <p className="text-blue-700 text-sm">관리자가 QA 진척 현황 링크를 설정 중입니다.<br />잠시 후 다시 확인해주세요.</p>
          </div>
        )}

        {user.status === "approved" && user.shareUrl && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: "80vh" }}>
            <iframe
              src={user.shareUrl}
              className="w-full h-full border-0"
              title="QA 진척 현황"
              allow="fullscreen"
            />
          </div>
        )}
      </main>
    </div>
  );
}
