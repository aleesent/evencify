import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface HeroSectionProps {
  onJoinCrew?: () => void;
  onHireCrew?: () => void;
  onGetStarted?: () => void;
  onScrollToHowItWorks?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinCrew,
  onHireCrew,
  onGetStarted,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handlePrimaryCta = onGetStarted || onHireCrew || onJoinCrew || (() => {});
  const prefersReducedMotion = useReducedMotion();

  // Subtle scroll parallax for the background image layer
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  // Easing curve: cubic-bezier(0.22, 1, 0.36, 1)
  const customEase = [0.22, 1, 0.36, 1] as const;

  // Stagger container for editorial text entrance
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: customEase,
      },
    },
  };

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
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.02, ease: customEase }}
          style={{ y: prefersReducedMotion ? 0 : parallaxY }}
          className="hero-bg-layer"
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
        <motion.div
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-[3] w-full max-w-[620px] xl:max-w-[680px]"
        >
          {/* 1. MAIN HEADING: "Event" (bold sans) + "made easy" (editorial italic serif) */}
          <motion.h1
            variants={itemVariants}
            className="text-black tracking-[-0.035em] leading-[0.98] sm:leading-[0.95]"
          >
            <span className="block text-[54px] sm:text-[70px] lg:text-[78px] xl:text-[88px] font-black font-sans">
              Event
            </span>
            <span className="block text-[56px] sm:text-[74px] lg:text-[82px] xl:text-[92px] font-editorial italic font-normal tracking-[-0.02em] text-black">
              made easy
            </span>
          </motion.h1>

          {/* 2. SUBORDINATE SUBHEADING: "The complete event management platform." */}
          <motion.h2
            variants={itemVariants}
            className="mt-6 sm:mt-7 text-[22px] sm:text-[28px] lg:text-[32px] xl:text-[34px] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.2] max-w-[560px]"
          >
            The complete event management<br className="hidden sm:inline" /> platform.
          </motion.h2>

          {/* 3. SUPPORTING PARAGRAPH: Clean modern sans with comfortable line-height */}
          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-5 text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-700 font-normal leading-[1.6] max-w-[520px] lg:max-w-[560px]"
          >
            Connect event organisers with professional crew, manage events, assignments and communication all in one place.
          </motion.p>

          {/* 4. PRIMARY CTA: Compact black pill/button with white text */}
          <motion.div variants={itemVariants} className="mt-8 sm:mt-9">
            <button
              id="hero-get-started-cta"
              onClick={handlePrimaryCta}
              className="group relative inline-flex items-center justify-center rounded-full bg-black text-white font-semibold text-[15px] sm:text-[16px] h-[52px] sm:h-[56px] w-[160px] sm:w-[170px] shadow-sm hover:scale-[1.025] hover:bg-neutral-900 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer tracking-tight"
              aria-label="Get started with Evencify"
            >
              <span>Get started</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

