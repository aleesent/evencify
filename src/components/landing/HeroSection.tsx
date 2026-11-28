import React, { useEffect, useRef } from 'react';

interface HeroSectionProps {
  onJoinCrew?: () => void;
  onHireCrew?: () => void;
  onGetStarted?: () => void;
  onScrollToHowItWorks?: () => void;
  onPreloadAuth?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinCrew,
  onHireCrew,
  onGetStarted,
  onPreloadAuth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const handlePrimaryCta = onGetStarted || onHireCrew || onJoinCrew || (() => {});

  // Lightweight GPU-composited scroll parallax without loading motion/react on first paint
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let rafId = 0;
    const updateParallax = () => {
      rafId = 0;
      const section = containerRef.current;
      const bg = bgLayerRef.current;
      if (!section || !bg) return;
      const height = section.offsetHeight || 1;
      const scrolled = Math.min(Math.max(window.scrollY, 0), height);
      const offsetY = (scrolled / height) * 24;
      bg.style.transform = `translate3d(0, ${offsetY.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="hero relative w-full min-h-screen lg:h-screen min-h-[660px] overflow-hidden bg-[#F8F9FD] flex flex-col justify-center"
    >
      {/* ========================================================================= */}
      {/* 1. FULL-BLEED IMMERSIVE BACKGROUND LAYER (.hero-background)               */}
      {/* ========================================================================= */}
      <div className="hero-background">
        {/* Base neutral canvas background matching showroom floor */}
        <div className="absolute inset-0 bg-[#F8F9FD]" />

        {/* Full-bleed background image covering viewport seamlessly without hard edges */}
        <div
          ref={bgLayerRef}
          className="hero-bg-layer will-change-transform"
          aria-hidden="true"
        />

        {/* Soft, invisible transition blend around edges and behind text */}
        <div className="hero-blend-layer" aria-hidden="true" />

        {/* Soft bottom seamless gradient fade into subsequent sections */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none bg-gradient-to-b from-transparent via-[#F8F9FD]/40 to-[#F8F9FD]"
          aria-hidden="true"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO CONTENT CONTAINER                                                 */}
      {/* Framed toward the upper-left with generous surrounding canvas             */}
      {/* ========================================================================= */}
      <div className="hero-content relative z-[2] w-full px-6 sm:px-12 lg:px-0 lg:pl-[10%] xl:pl-[12%] pt-[100px] sm:pt-[110px] lg:pt-[90px] pb-12 sm:pb-16 my-auto flex flex-col justify-center">
        {/* Left text column placed directly on top of the image (no box, no card) */}
        <div className="relative z-[3] w-full max-w-[620px] xl:max-w-[680px]">
          {/* 1. VISUAL DISPLAY TITLE: "Event" (bold sans) + "made easy" (editorial italic serif) */}
          <div className="text-black tracking-[-0.035em] leading-[0.98] sm:leading-[0.95]">
            <span className="block text-[54px] sm:text-[70px] lg:text-[78px] xl:text-[88px] font-black font-sans">
              Event
            </span>
            <span className="block text-[56px] sm:text-[74px] lg:text-[82px] xl:text-[92px] font-editorial italic font-normal tracking-[-0.02em] text-black">
              made easy
            </span>
          </div>

          {/* 2. PRIMARY H1 HEADING */}
          <h1 className="mt-6 sm:mt-7 text-[22px] sm:text-[28px] lg:text-[32px] xl:text-[34px] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.2] max-w-[560px]">
            India&apos;s Event Crew &amp; Organiser Platform
          </h1>

          {/* 3. SUPPORTING PARAGRAPH: Clean modern sans with comfortable line-height */}
          <p className="mt-4 sm:mt-5 text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-700 font-normal leading-[1.6] max-w-[520px] lg:max-w-[560px]">
            Evencify connects event organisers with verified event crew in Surat and across India—manage staffing, shifts, and assignments in one place.
          </p>

          {/* 4. PRIMARY CTA: Compact black pill/button with white text */}
          <div className="mt-8 sm:mt-9">
            <button
              id="hero-get-started-cta"
              type="button"
              onClick={handlePrimaryCta}
              onMouseEnter={onPreloadAuth}
              onFocus={onPreloadAuth}
              onTouchStart={onPreloadAuth}
              className="group relative inline-flex items-center justify-center rounded-full bg-black text-white font-semibold text-[15px] sm:text-[16px] h-[52px] sm:h-[56px] w-[160px] sm:w-[170px] shadow-sm hover:scale-[1.025] hover:bg-neutral-900 active:scale-[0.98] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer tracking-tight"
              aria-label="Get started with Evencify"
            >
              <span>Get started</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


