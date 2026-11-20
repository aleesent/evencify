import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { HOMEPAGE_FAQS } from '../../services/seoData';

export const FaqSection: React.FC = () => {
  // Only one FAQ open at a time; first one open by default for immediate visual feedback
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative bg-white text-neutral-950 py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      <div className="relative mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            <span>FAQ </span>
            <span
              className="font-editorial font-serif italic font-normal text-neutral-900"
              style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
            >
              answered
            </span>
          </h2>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="w-full divide-y divide-neutral-200/80 border-t border-b border-neutral-200/80">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`transition-colors duration-200 ${
                  isOpen
                    ? 'bg-[#FED000]/[0.035]'
                    : 'hover:bg-neutral-50/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.number}`}
                  className="group w-full py-6 sm:py-8 px-3 sm:px-6 text-left flex items-start justify-between gap-4 sm:gap-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-xl"
                >
                  <div className="flex items-baseline gap-4 sm:gap-7 flex-1 min-w-0">
                    {/* Number in elegant italic serif */}
                    <span
                      className={`font-editorial font-serif italic font-normal text-2xl sm:text-3xl md:text-4xl shrink-0 select-none transition-colors duration-200 w-9 sm:w-12 text-left ${
                        isOpen
                          ? 'text-neutral-900'
                          : 'text-neutral-400 group-hover:text-neutral-700'
                      }`}
                      style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
                    >
                      {faq.number}
                    </span>

                    {/* Question text in bold sans-serif */}
                    <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-900 leading-snug group-hover:text-black transition-colors pt-0.5">
                      {faq.question}
                    </span>
                  </div>

                  {/* Plus / Minus Indicator */}
                  <div
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ml-2 mt-0.5 ${
                      isOpen
                        ? 'text-neutral-950 bg-[#FED000]/20'
                        : 'text-neutral-400 group-hover:text-neutral-900 group-hover:bg-neutral-100'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2]" />
                    ) : (
                      <Plus className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2]" />
                    )}
                  </div>
                </button>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.number}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.25, ease: 'easeOut' },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 sm:pb-8 pt-1 pl-12 sm:pl-[100px] pr-4 sm:pr-16">
                        <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
