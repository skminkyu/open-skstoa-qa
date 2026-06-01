"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  companyName: string;
  email: string;
  status: string;
  shareUrl: string | null;
  createdAt: Date;
}

interface Props {
  users: User[];
  highlight?: boolean;
}

export default function AdminUserTable({ users, highlight }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shareUrlInput, setShareUrlInput] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(id: string, status: string, shareUrl?: string) {
    setLoading(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, shareUrl }),
      });
      if (res.ok) {
        router.refresh();
        setEditingId(null);
      }
    } finally {
      setLoading(null);
    }
  }

  function startApprove(user: User) {
    setEditingId(user.id);
    setShareUrlInput(user.shareUrl || "");
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">협력사명</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">이메일</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">상태</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">QA 현황 URL</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">신청일</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={`border-b border-gray-50 last:border-0 ${highlight ? "bg-yellow-50/40" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{user.companyName}</td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-xs">
                {editingId === user.id ? (
                  <input
                    type="url"
                    value={shareUrlInput}
                    onChange={(e) => setShareUrlInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1"
                    placeholder="https://..."
                  />
                ) : (
                  <span className="text-xs truncate block max-w-[200px]" title={user.shareUrl || ""}>
                    {user.shareUrl ? (
                      <a href={user.shareUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.shareUrl.length > 40 ? user.shareUrl.substring(0, 40) + "..." : user.shareUrl}
                      </a>
                    ) : (
                      <span className="text-gray-300">미설정</span>
                    )}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {new Date(user.createdAt).toLocaleDateString("ko-KR")}
              </td>
              <td className="px-4 py-3 text-right">
                {editingId === user.id ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleAction(user.id, "approved", shareUrlInput || undefined)}
                      disabled={loading === user.id}
                      className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-60"
                      style={{ backgroundColor: "#22c55e" }}
                    >
                      {loading === user.id ? "처리 중..." : "확인"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end">
                    {user.status !== "approved" && (
                      <button
                        onClick={() => startApprove(user)}
                        disabled={loading === user.id}
                        className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-60"
                        style={{ backgroundColor: "#22c55e" }}
                      >
                        승인
                      </button>
                    )}
                    {user.status === "approved" && (
                      <button
                        onClick={() => startApprove(user)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 font-medium"
                      >
                        URL 수정
                      </button>
                    )}
                    {user.status !== "rejected" && (
                      <button
                        onClick={() => handleAction(user.id, "rejected")}
                        disabled={loading === user.id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 font-medium disabled:opacity-60"
                      >
                        거절
                      </button>
                    )}
                    {user.status === "rejected" && (
                      <button
                        onClick={() => startApprove(user)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium"
                      >
                        재승인
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "대기 중", className: "bg-yellow-100 text-yellow-700" },
    approved: { label: "승인", className: "bg-green-100 text-green-700" },
    rejected: { label: "거절", className: "bg-gray-100 text-gray-500" },
  };
  const s = map[status] || { label: status, className: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
}
