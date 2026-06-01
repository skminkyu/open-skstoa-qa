import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AdminUserTable from "@/components/AdminUserTable";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  const users = await prisma.user.findMany({
    where: { role: "partner" },
    select: { id: true, companyName: true, email: true, status: true, shareUrl: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved");
  const rejected = users.filter((u) => u.status === "rejected");

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
            <span className="text-sm text-gray-600 bg-red-50 px-2 py-1 rounded-md font-medium" style={{ color: "#e63329" }}>관리자</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-500 text-sm mt-1">협력사 가입 신청을 승인하고 QA 진척 현황 링크를 설정하세요.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{pending.length}</div>
            <div className="text-sm text-gray-500 mt-1">승인 대기</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{approved.length}</div>
            <div className="text-sm text-gray-500 mt-1">승인 완료</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-gray-400">{rejected.length}</div>
            <div className="text-sm text-gray-500 mt-1">거절</div>
          </div>
        </div>

        {/* Pending section */}
        {pending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
              승인 대기 중 ({pending.length})
            </h2>
            <AdminUserTable users={pending} highlight />
          </div>
        )}

        {/* Approved section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            승인 완료 ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-400 text-sm">
              승인된 사용자가 없습니다.
            </div>
          ) : (
            <AdminUserTable users={approved} />
          )}
        </div>

        {/* Rejected section */}
        {rejected.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
              거절 ({rejected.length})
            </h2>
            <AdminUserTable users={rejected} />
          </div>
        )}
      </main>
    </div>
  );
}
