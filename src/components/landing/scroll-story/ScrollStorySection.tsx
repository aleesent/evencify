import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { ScrollStorySectionProps } from './types';
import { FeatureVisual } from './FeatureVisual';
import { FeatureContent } from './FeatureContent';

// Soft, subtle ambient background tones for each step
const STEP_BACKGROUND_COLORS = [
  '#FBFBFA', // STATE 01: Pure warm neutral
  '#F2F6FA', // STATE 02: Gentle sky whisper
  '#F6F3F9', // STATE 03: Gentle lavender whisper
  '#F9F4EE', // STATE 04: Gentle peach whisper
  '#F2F7F4', // STATE 05: Gentle sage whisper
  '#F8F6F0', // STATE 06: Gentle sand whisper
];

export const ScrollStorySection: React.FC<ScrollStorySectionProps> = ({
  id,
  theme = 'crew',
  sectionBadge,
  steps,
  primaryCtaText,
  onPrimaryCta,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const STEP_DURATION = 5000; // ms per step

  // Progression timer (pauses when user hovers or interacts)
  useEffect(() => {
    if (isHovered) return;

    const interval = 50;
    const stepIncrement = (interval / STEP_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((curr) => (curr + 1) % steps.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isHovered, steps.length]);

  const handleSelectStep = useCallback((index: number) => {
    setActiveStep(index);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveStep((curr) => (curr === 0 ? steps.length - 1 : curr - 1));
    setProgress(0);
  }, [steps.length]);

  const handleNext = useCallback(() => {
    setActiveStep((curr) => (curr + 1) % steps.length);
    setProgress(0);
  }, [steps.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;

    setTilt({ x: rotateX, y: rotateY });
    setSheenPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSheenPos({ x: 50, y: 50 });
    setIsHovered(false);
  };

  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const diffX = touchStartRef.current.x - e.changedTouches[0].clientX;
      const diffY = touchStartRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  const currentStep = steps[activeStep] || steps[0];
  const activeBgColor =
    STEP_BACKGROUND_COLORS[activeStep % STEP_BACKGROUND_COLORS.length];

  return (
    <section
      id={id}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative bg-white text-neutral-900 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12 scroll-mt-20 outline-none"
      aria-label={sectionBadge || 'How It Works'}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* SECTION HEADER: Clean, modern, professional */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold tracking-wider text-neutral-600 uppercase mb-3">
              <span>{sectionBadge || 'HOW IT WORKS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
              {theme === 'crew' ? (
                <>
                  From sign-up to daily pay.{' '}
                  <span className="underline decoration-[#FED000] decoration-4 underline-offset-4">
                    Zero hassle.
                  </span>
                </>
              ) : (
                <>
                  Staff your next event with{' '}
                  <span className="underline decoration-neutral-900 decoration-4 underline-offset-4">
                    verified pros.
                  </span>
                </>
              )}
            </h2>
          </div>
        </div>

        {/* NEAT & CLEAN STEP NAVIGATION (01 TO 06) - NO BLACK BOXES OR HEAVY BORDERS */}
        <div className="relative mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-2">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-neutral-100/90 rounded-full min-w-max border border-neutral-200/60 shadow-2xs">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(idx)}
                  className={`relative px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    isActive
                      ? 'bg-white text-neutral-950 shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                  aria-label={`Step ${step.stepNumber}: ${step.category}`}
                  aria-selected={isActive}
                >
                  <span
                    className={`font-mono text-[11px] ${
                      isActive ? 'text-neutral-950 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span className="tracking-wide uppercase text-[11px]">
                    {step.category}
                  </span>

                  {/* Clean, subtle progress indicator */}
                  {isActive && !isHovered && (
                    <motion.div
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#FED000] rounded-full"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: progress / 100 }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN STAGE WRAPPER WITH CLEAN, PROFESSIONAL FLANKING ARROWS */}
        <div className="relative px-0 sm:px-3 md:px-5">
          {/* CLEAN & PROFESSIONAL LEFT ARROW */}
          <button
            onClick={handlePrev}
            className="group absolute -left-2.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-neutral-700 hover:text-neutral-950 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-neutral-200/80 hover:border-neutral-300 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Previous step"
          >
            <ChevronLeft
              className="h-5 w-5 transition-transform duration-150 group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
          </button>

          {/* CLEAN & PROFESSIONAL RIGHT ARROW */}
          <button
            onClick={handleNext}
            className="group absolute -right-2.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-neutral-700 hover:text-neutral-950 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-neutral-200/80 hover:border-neutral-300 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Next step"
          >
            <ChevronRight
              className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </button>

          {/* MAIN STAGE CONTAINER - SOFT, AIRY, REFINED */}
          <div
            style={{
              backgroundColor: activeBgColor,
              transition: 'background-color 0.5s ease',
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-5 sm:p-8 lg:p-12 shadow-xs overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center relative z-10">
              {/* LEFT / TOP: 3D CARD DECK - CLEAN & PROFESSIONAL (NO BLACK BOXES OR HEAVY BORDERS) */}
              <div
                className="lg:col-span-6 flex flex-col items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  ref={cardContainerRef}
                  style={{
                    perspective: '1200px',
                  }}
                  className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[430px] lg:max-w-[460px] h-[230px] xs:h-[260px] sm:h-[320px] md:h-[360px] lg:h-[395px] mx-auto cursor-grab active:cursor-grabbing"
                >
                  {/* Subtle soft elevation backdrop */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-black/[0.03] transform translate-y-2 scale-[0.98] blur-xs pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Main Dynamic 3D Card with Soft Spring Animation */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep.id}
                      initial={{
                        opacity: 0,
                        scale: 0.94,
                        y: 12,
                        rotateX: shouldReduceMotion ? 0 : 6,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        rotateX: shouldReduceMotion ? 0 : tilt.x,
                        rotateY: shouldReduceMotion ? 0 : tilt.y,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.94,
                        y: -12,
                        rotateX: shouldReduceMotion ? 0 : -6,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 26,
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, opacity',
                      }}
                      className="absolute inset-0 rounded-2xl overflow-hidden border border-neutral-200/90 bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] flex flex-col"
                    >
                      {/* Clean, airy card header (no black box!) */}
                      <div className="bg-neutral-50/90 backdrop-blur-xs px-4 py-2 border-b border-neutral-100 flex items-center justify-between text-neutral-600 text-[11px] font-medium shrink-0 select-none">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-neutral-800">
                          {theme === 'crew' ? 'Crew Pass' : 'Organiser Portal'}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          {currentStep.stepNumber} of 06
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="flex-1 relative overflow-hidden">
                        <FeatureVisual type={currentStep.visualType} />

                        {/* Interactive Specular Dynamic Sheen */}
                        {!shouldReduceMotion && (
                          <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle 280px at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.4) 0%, transparent 70%)`,
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT / BOTTOM: EDITORIAL TEXT & ACTION DETAILS */}
              <div
                className="lg:col-span-6 flex flex-col justify-center lg:pl-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <FeatureContent
                      step={currentStep}
                      totalSteps={steps.length}
                      onPrimaryCta={onPrimaryCta}
                    />

                    {/* Primary CTA Action */}
                    {primaryCtaText && (
                      <div className="mt-6 sm:mt-8">
                        <button
                          onClick={onPrimaryCta}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-all shadow-xs hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          <span>{primaryCtaText}</span>
                          <ArrowRight className="h-4 w-4 text-[#FED000]" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
