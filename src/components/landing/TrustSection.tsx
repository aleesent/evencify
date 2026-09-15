import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface TrustSectionProps {
  onCreateAccount?: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onCreateAccount }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCtaClick = () => {
    if (onCreateAccount) {
      onCreateAccount();
      return;
    }

    // Trigger signup action on the page if available
    const signupBtn = document.querySelector<HTMLButtonElement>(
      '#final-cta-join-btn, button[data-action="signup"], #hero-join-btn'
    );
    if (signupBtn) {
      signupBtn.click();
      return;
    }

    // Fallback: navigate to registration / CTA section smoothly
    const ctaSection = document.getElementById('final-cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="trust"
      className="trust-section relative w-full m-0 p-0 scroll-mt-20 overflow-hidden bg-white"
      style={{
        position: 'relative',
        background: '#ffffff',
        overflow: 'hidden',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        className="trust-image-wrapper relative w-full"
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        {/* The complete untouched trust.png image with natural aspect ratio and zero cropping */}
        <img
          id="trust-section-visual"
          src="/trust.png"
          alt="Trust, reliability and escrow safety"
          className="w-full h-auto max-w-none block select-none pointer-events-none"
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: 'none',
            display: 'block',
            WebkitMaskImage:
              'radial-gradient(ellipse 96% 94% at 50% 50%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)',
            maskImage:
              'radial-gradient(ellipse 96% 94% at 50% 50%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)',
          }}
          loading="lazy"
          decoding="async"
        />

        {/* Top soft feathered edge transition into page background */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-14 sm:h-20 lg:h-28 z-10"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom soft feathered edge transition into page background */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 sm:h-16 lg:h-24 z-10"
          style={{
            background: 'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Left soft feathered edge transition */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-6 sm:w-12 lg:w-20 z-10"
          style={{
            background: 'linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Right soft feathered edge transition */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 right-0 w-6 sm:w-12 lg:w-20 z-10"
          style={{
            background: 'linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Supporting editorial text overlaid directly across the open sky space horizontally */}
        <div
          className="text-content absolute z-20 pointer-events-auto left-4 right-4 xs:left-6 xs:right-6 sm:left-[6%] sm:right-auto top-2.5 xs:top-3.5 sm:top-[7%] md:top-[8%] sm:max-w-[540px] lg:max-w-[620px]"
        >
          {/* 1. Eyebrow: TRUST, RELIABILITY & ESCROW SAFETY */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.6,
              delay: 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              id="trust-section-eyebrow"
              className="text-[8px] xs:text-[9.5px] sm:text-xs md:text-sm font-semibold tracking-wider text-neutral-600 uppercase mb-0.5 xs:mb-1 sm:mb-2"
            >
              TRUST, RELIABILITY & ESCROW SAFETY
            </p>
          </motion.div>

          {/* 2. Headline: Built on transparency. Protected by escrow. */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h2
              id="trust-section-headline"
              className="text-[15px] xs:text-[18px] sm:text-3xl md:text-4xl lg:text-[42px] tracking-tight leading-tight sm:leading-[1.15]"
            >
              <span className="font-sans font-bold text-neutral-950">Built on transparency. </span>
              <span className="font-serif italic font-normal text-neutral-900 sm:block sm:mt-1">
                Protected by escrow.
              </span>
            </h2>
          </motion.div>

          {/* 3. Paragraph: Events run on real trust... */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.6,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              id="trust-section-body"
              className="mt-1 xs:mt-1.5 sm:mt-3 md:mt-4 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-[16px] text-neutral-800/90 font-normal leading-snug sm:leading-relaxed max-w-xl"
            >
              <span className="sm:hidden">
                Automated escrow verification, two-way ratings, and emergency standbys for every shift.
              </span>
              <span className="hidden sm:inline">
                Events run on real trust. We eliminate the uncertainty of freelancing with automated escrow verification, two-way ratings, and emergency standbys.
              </span>
            </p>
          </motion.div>

          {/* 4. Button: Create Account → */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.6,
              delay: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-2 xs:mt-2.5 sm:mt-5 md:mt-6 flex items-center gap-2.5"
          >
            <button
              id="trust-section-create-account-btn"
              type="button"
              onClick={handleCtaClick}
              className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-neutral-950 px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-2.5 text-[10px] xs:text-xs sm:text-sm font-medium text-white hover:bg-neutral-800 transition-all duration-200 hover:translate-x-0.5 shadow-sm cursor-pointer shrink-0"
            >
              <span>Create Account</span>
              <span
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
            <span className="hidden xs:inline-flex sm:hidden items-center gap-1 font-mono text-[8.5px] text-neutral-700 bg-white/80 px-2 py-1 rounded-full border border-neutral-300/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>100% Escrow Guaranteed</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
