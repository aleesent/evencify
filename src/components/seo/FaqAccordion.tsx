import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  title = 'Frequently Asked Questions',
  description = 'Everything you need to know about upcoming events, venues, and booking on Evencify.',
  faqs,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="my-12 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FED000]/20 text-neutral-900">
          <HelpCircle className="h-4 w-4" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{title}</h2>
      </div>
      <p className="text-sm text-neutral-500 mb-6 max-w-2xl">{description}</p>

      <div className="divide-y divide-neutral-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-4 text-left font-semibold text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-neutral-900' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2.5 pr-6 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
