"use client";

import { useState } from "react";

interface Props {
  urls: string[];
}

export default function DashboardTabs({ urls }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: "82vh" }}>
      {urls.length > 1 && (
        <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto shrink-0">
          {urls.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeIdx === idx
                  ? "border-red-500 text-red-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              상품 {idx + 1}
            </button>
          ))}
        </div>
      )}
      <iframe
        key={activeIdx}
        src={urls[activeIdx]}
        className="w-full flex-1 border-0"
        title={`QA 진척 현황 ${activeIdx + 1}`}
        allow="fullscreen"
      />
    </div>
  );
}
