"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
          >
            <h3 className="font-heading font-bold text-lg text-black pr-4">
              {item.question}
            </h3>
            <svg
              className="w-5 h-5 text-black/40 flex-shrink-0 transition-transform duration-300"
              style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: openIndex === i ? "500px" : "0",
              opacity: openIndex === i ? 1 : 0,
            }}
          >
            <p className="text-text-light leading-relaxed px-6 pb-6">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
