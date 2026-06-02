import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e63329" }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">SK스토아 QA 파트너 포털</span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-gray-600">{session.companyName}</span>
                <Link
                  href={session.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-sm font-medium px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#e63329" }}
                >
                  {session.role === "admin" ? "관리자 페이지" : "대시보드"}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#e63329" }}
                >
                  사용자 등록
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-white py-16 px-4" style={{ background: "linear-gradient(135deg, #e63329 0%, #c0271e 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">SK스토아 QA 파트너 포털</h1>
          <p className="text-xl opacity-90">협력사 QA 업무에 필요한 모든 서비스를 한 곳에서</p>
        </div>
      </section>

      {/* Cards */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: KakaoTalk */}
          <a
            href="http://pf.kakao.com/_lxaExkxj"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex flex-col items-center text-center border border-gray-100 hover:border-yellow-300"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: "#FEE500" }}>
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="#391B1B">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.07 4.02 6.52L5 21l4.38-2.3C10.22 18.87 11.1 19 12 19c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">QA 가이드 채널</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              SK스토아 QA 가이드 카카오톡 채널에서<br />
              최신 QA 정보와 공지를 확인하세요.
            </p>
            <span className="text-sm font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: "#FEE500", color: "#391B1B" }}>
              카카오톡 채널 바로가기 →
            </span>
          </a>

          {/* Card 2: QA Archive */}
          <a
            href="https://sk-stoa-qa-archive.netlify.app/#home"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex flex-col items-center text-center border border-gray-100 hover:border-blue-300"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: "#EFF6FF" }}>
              <svg className="w-9 h-9" fill="none" stroke="#3B82F6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">QA 아카이브</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              SK스토아 QA 아카이브에서<br />
              과거 QA 자료와 레퍼런스를 열람하세요.
            </p>
            <span className="text-sm font-semibold px-4 py-2 rounded-full text-blue-700" style={{ backgroundColor: "#DBEAFE" }}>
              QA 아카이브 바로가기 →
            </span>
          </a>

          {/* Card 3: QA Progress */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex flex-col items-center text-center border border-gray-100 hover:border-red-200">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: "#FEF2F2" }}>
              <svg className="w-9 h-9" fill="none" stroke="#e63329" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">상품 QA 진척 현황</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              자사 상품의 QA 진행 상황을<br />
              실시간으로 확인하세요.
            </p>
            {session ? (
              session.role === "admin" ? (
                <Link
                  href="/admin"
                  className="text-sm font-semibold px-4 py-2 rounded-full text-white"
                  style={{ backgroundColor: "#e63329" }}
                >
                  관리자 페이지로 이동 →
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold px-4 py-2 rounded-full text-white"
                  style={{ backgroundColor: "#e63329" }}
                >
                  QA 진척 현황 확인 →
                </Link>
              )
            ) : (
              <div className="flex flex-col gap-2 w-full items-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-full text-white"
                  style={{ backgroundColor: "#e63329" }}
                >
                  로그인하여 확인하기 →
                </Link>
                <Link href="/register" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  처음 방문하셨나요? 사용자 등록
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="#e63329" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            이용 안내
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: "#e63329" }}>•</span>
              <span><strong>QA 진척 현황</strong> 서비스는 협력사 담당자 전용입니다. 처음 방문 시 <strong>사용자 등록</strong>을 통해 가입 신청 후, 관리자 승인을 받으면 이용 가능합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: "#e63329" }}>•</span>
              <span>사용자 등록 시 <strong>협력사명(회사 이름)</strong>을 정확하게 입력해주세요. 해당 협력사명으로 등록된 상품 QA 현황만 조회됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: "#e63329" }}>•</span>
              <span>서비스 이용 문의는 SK스토아 QA 가이드 카카오톡 채널을 통해 문의해주세요.</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-6 px-4 text-center">
        <p>© 2026 SK스토아 품질관리팀. All rights reserved.</p>
      </footer>
    </div>
  );
}
