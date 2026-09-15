import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { ScrollStorySectionProps } from './types';
import { FeatureVisual } from './FeatureVisual';
import { FeatureContent } from './FeatureContent';

// Editorial soft background palette for scroll states (as specified)
const STEP_BACKGROUND_COLORS = [
  '#F5F4EF', // STATE 01: Soft warm off-white
  '#EAF2FA', // STATE 02: Soft cool sky tint
  '#F2EEF7', // STATE 03: Soft lavender tint
  '#F7F0E8', // STATE 04: Soft warm peach tint
  '#EDF3F0', // STATE 05: Soft sage tint
  '#F4F2EA', // STATE 06: Soft sand tint
];

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  return [
    parseInt(clean.substring(0, 2), 16) || 245,
    parseInt(clean.substring(2, 4), 16) || 244,
    parseInt(clean.substring(4, 6), 16) || 239,
  ];
}

function interpolateRgb(color1: string, color2: string, factor: number): string {
  const [r1, g1, b1] = parseHex(color1);
  const [r2, g2, b2] = parseHex(color2);
  const f = Math.max(0, Math.min(1, factor));
  const r = Math.round(r1 + (r2 - r1) * f);
  const g = Math.round(g1 + (g2 - g1) * f);
  const b = Math.round(b1 + (b2 - b1) * f);
  return `rgb(${r}, ${g}, ${b})`;
}

export const ScrollStorySection: React.FC<ScrollStorySectionProps> = ({
  id,
  sectionBadge,
  steps,
  onPrimaryCta,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerBoxRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let rafId: number | null = null;

    const updateAnimation = () => {
      const section = containerRef.current;
      const outerBox = outerBoxRef.current;
      if (!section || !outerBox) return;

      const rect = section.getBoundingClientRect();
      const totalScroll = section.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      // Calculate continuous scroll progress [0, 1] relative to the pinned section
      const rawProgress = -rect.top / totalScroll;
      const progress = Math.max(0, Math.min(1, rawProgress));

      const stepCount = steps.length;
      if (stepCount <= 1) return;

      // 6 states -> 5 continuous transition intervals
      const stateProgress = progress * (stepCount - 1);
      const currentIndex = Math.min(Math.floor(stateProgress), stepCount - 2);
      const transitionProgress = Math.max(0, Math.min(1, stateProgress - currentIndex));

      // 1. Continuous Background Color Interpolation across the section
      const color1 = STEP_BACKGROUND_COLORS[currentIndex % STEP_BACKGROUND_COLORS.length];
      const color2 = STEP_BACKGROUND_COLORS[(currentIndex + 1) % STEP_BACKGROUND_COLORS.length];
      const currentBg = interpolateRgb(color1, color2, transitionProgress);
      outerBox.style.backgroundColor = currentBg;

      // 2. Sequential 3-Phase Content Swap (Zero Overlap)
      const isReduced = !!shouldReduceMotion;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const maxCardDist = isReduced ? 0 : (isMobile ? 25 : 50); // Proportional physical card translation
      const maxTextDist = isReduced ? 0 : (isMobile ? 18 : 35); // Proportional physical text translation
      const maxRotate = isReduced ? 0 : (isMobile ? 0.5 : 1.0);  // Subtle physical tilt
      const minScale = isReduced ? 1 : (isMobile ? 0.98 : 0.97);  // Scale factor

      // Calculate 3 phases for the transition between currentIndex and currentIndex + 1:
      // Phase 1 (Exit): 0.00 -> 0.45
      // Phase 2 (Clean Gap): 0.45 -> 0.55
      // Phase 3 (Enter): 0.55 -> 1.00
      let exitProgress = 0;
      let enterProgress = 0;
      let phase: 'exit' | 'gap' | 'enter' = 'exit';

      if (transitionProgress < 0.45) {
        phase = 'exit';
        const rawExit = transitionProgress / 0.45;
        // Cubic Hermite smoothstep for natural easing
        exitProgress = rawExit * rawExit * (3 - 2 * rawExit);
      } else if (transitionProgress <= 0.55) {
        phase = 'gap';
      } else {
        phase = 'enter';
        const rawEnter = (transitionProgress - 0.55) / 0.45;
        // Cubic Hermite smoothstep for natural easing
        enterProgress = rawEnter * rawEnter * (3 - 2 * rawEnter);
      }

      for (let i = 0; i < stepCount; i++) {
        const cardEl = cardRefs.current[i];
        const textEl = textRefs.current[i];
        const dotEl = dotRefs.current[i];

        // --- A. Vertical Progress Dots ---
        if (dotEl) {
          if (i === currentIndex) {
            if (phase === 'exit') {
              // Strongly active
              dotEl.style.backgroundColor = '#171717';
              dotEl.style.transform = 'scale(1.25)';
            } else if (phase === 'gap') {
              // Shift emphasis in gap window
              const gapT = (transitionProgress - 0.45) / 0.10;
              dotEl.style.backgroundColor = interpolateRgb('#171717', '#D4D4D4', gapT);
              dotEl.style.transform = `scale(${1.25 - 0.25 * gapT})`;
            } else {
              // Inactive
              dotEl.style.backgroundColor = '#D4D4D4';
              dotEl.style.transform = 'scale(1)';
            }
          } else if (i === currentIndex + 1) {
            if (phase === 'exit') {
              // Inactive
              dotEl.style.backgroundColor = '#D4D4D4';
              dotEl.style.transform = 'scale(1)';
            } else if (phase === 'gap') {
              // Shift emphasis in gap window
              const gapT = (transitionProgress - 0.45) / 0.10;
              dotEl.style.backgroundColor = interpolateRgb('#D4D4D4', '#171717', gapT);
              dotEl.style.transform = `scale(${1 + 0.25 * gapT})`;
            } else {
              // Strongly active
              dotEl.style.backgroundColor = '#171717';
              dotEl.style.transform = 'scale(1.25)';
            }
          } else {
            dotEl.style.backgroundColor = '#D4D4D4';
            dotEl.style.transform = 'scale(1)';
          }
        }

        // --- B. Product Cards & Text Composition ---
        if (!cardEl || !textEl) continue;

        if (i === currentIndex) {
          if (phase === 'exit') {
            // Outgoing State: physically moves upward (-50px/-35px), scale down, tilts slightly, fades out
            const cardY = -maxCardDist * exitProgress;
            const cardScale = 1 - (1 - minScale) * exitProgress;
            const cardRotate = -maxRotate * exitProgress;
            const opacity = 1 - exitProgress;
            const isInteractive = opacity > 0.5;

            cardEl.style.opacity = `${opacity}`;
            cardEl.style.transform = `translate3d(0, ${cardY}px, 0) scale(${cardScale}) rotate(${cardRotate}deg)`;
            cardEl.style.zIndex = '20';
            cardEl.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
            cardEl.style.pointerEvents = isInteractive ? 'auto' : 'none';

            const textY = -maxTextDist * exitProgress;
            textEl.style.opacity = `${opacity}`;
            textEl.style.transform = `translate3d(0, ${textY}px, 0)`;
            textEl.style.zIndex = '20';
            textEl.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
            textEl.style.pointerEvents = isInteractive ? 'auto' : 'none';
          } else {
            // In gap or enter phase: outgoing content is completely hidden (zero ghosting)
            cardEl.style.opacity = '0';
            cardEl.style.transform = `translate3d(0, ${-maxCardDist}px, 0) scale(${minScale}) rotate(${-maxRotate}deg)`;
            cardEl.style.zIndex = '5';
            cardEl.style.visibility = 'hidden';
            cardEl.style.pointerEvents = 'none';

            textEl.style.opacity = '0';
            textEl.style.transform = `translate3d(0, ${-maxTextDist}px, 0)`;
            textEl.style.zIndex = '5';
            textEl.style.visibility = 'hidden';
            textEl.style.pointerEvents = 'none';
          }
        } else if (i === currentIndex + 1) {
          if (phase === 'enter') {
            // Incoming State: enters from below (+50px/+35px -> 0), scales up, straightens, fades in
            const cardY = maxCardDist * (1 - enterProgress);
            const cardScale = minScale + (1 - minScale) * enterProgress;
            const cardRotate = maxRotate * (1 - enterProgress);
            const opacity = enterProgress;
            const isInteractive = opacity >= 0.5;

            cardEl.style.opacity = `${opacity}`;
            cardEl.style.transform = `translate3d(0, ${cardY}px, 0) scale(${cardScale}) rotate(${cardRotate}deg)`;
            cardEl.style.zIndex = '20';
            cardEl.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
            cardEl.style.pointerEvents = isInteractive ? 'auto' : 'none';

            const textY = maxTextDist * (1 - enterProgress);
            textEl.style.opacity = `${opacity}`;
            textEl.style.transform = `translate3d(0, ${textY}px, 0)`;
            textEl.style.zIndex = '20';
            textEl.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
            textEl.style.pointerEvents = isInteractive ? 'auto' : 'none';
          } else {
            // In exit or gap phase: incoming content is strictly hidden (zero overlap with current state)
            cardEl.style.opacity = '0';
            cardEl.style.transform = `translate3d(0, ${maxCardDist}px, 0) scale(${minScale}) rotate(${maxRotate}deg)`;
            cardEl.style.zIndex = '5';
            cardEl.style.visibility = 'hidden';
            cardEl.style.pointerEvents = 'none';

            textEl.style.opacity = '0';
            textEl.style.transform = `translate3d(0, ${maxTextDist}px, 0)`;
            textEl.style.zIndex = '5';
            textEl.style.visibility = 'hidden';
            textEl.style.pointerEvents = 'none';
          }
        } else {
          // Inactive state outside transition window: completely hidden
          const isPast = i < currentIndex;
          const cardY = isPast ? -maxCardDist : maxCardDist;
          const textY = isPast ? -maxTextDist : maxTextDist;

          cardEl.style.opacity = '0';
          cardEl.style.transform = `translate3d(0, ${cardY}px, 0) scale(${minScale}) rotate(0deg)`;
          cardEl.style.zIndex = '5';
          cardEl.style.visibility = 'hidden';
          cardEl.style.pointerEvents = 'none';

          textEl.style.opacity = '0';
          textEl.style.transform = `translate3d(0, ${textY}px, 0)`;
          textEl.style.zIndex = '5';
          textEl.style.visibility = 'hidden';
          textEl.style.pointerEvents = 'none';
        }
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateAnimation();
      });
    };

    // Initial render setup
    updateAnimation();
    const initTimer = requestAnimationFrame(updateAnimation);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateAnimation();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      cancelAnimationFrame(initTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [steps, shouldReduceMotion]);

  return (
    <section
      id={id}
      ref={containerRef}
      style={{
        // 600vh total height ensures ample scroll distance (approx 100vh per transition) for deliberate, slow observation
        height: '600vh',
      }}
      className="relative bg-white text-black scroll-mt-20"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden px-2.5 xs:px-4 sm:px-6 lg:px-10 py-1.5 sm:py-6 lg:py-8">
        <div className="mx-auto w-full max-w-6xl flex flex-col justify-center relative">
          
          {/* SECTION HEADER: Clean, understated uppercase title */}
          <div className="mb-1.5 sm:mb-4 lg:mb-8 text-center shrink-0">
            <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400">
              {sectionBadge || 'HOW IT WORKS'}
            </span>
          </div>

          {/* ONE LARGE SOFT OUTER SECTION / CONTAINER */}
          <div
            ref={outerBoxRef}
            className="relative w-full rounded-[20px] xs:rounded-[24px] sm:rounded-[32px] overflow-hidden"
            style={{
              backgroundColor: STEP_BACKGROUND_COLORS[0],
              padding: 'clamp(12px, 2.8vw, 48px)',
              willChange: 'background-color',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 xs:gap-3.5 sm:gap-6 lg:gap-16 items-center">
              
              {/* LEFT / BOTTOM ON MOBILE: Fixed Card Stage */}
              <div className="order-2 lg:order-1 lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] h-[195px] xs:h-[215px] sm:h-[300px] md:h-[340px] lg:h-[385px] mx-auto">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        willChange: 'transform, opacity',
                      }}
                      className="w-full h-full flex flex-col"
                    >
                      <FeatureVisual type={step.visualType} />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT / TOP ON MOBILE: Content block with continuous scroll physical transition */}
              <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col justify-center lg:pr-10">
                <div className="relative w-full min-h-[120px] xs:min-h-[135px] sm:min-h-[190px] md:min-h-[230px] lg:min-h-[280px] flex items-center">
                  {/* Invisible structural spacer to preserve dynamic container height without layout shifts */}
                  <div
                    className="invisible pointer-events-none select-none opacity-0"
                    aria-hidden="true"
                  >
                    <FeatureContent step={steps[1] || steps[0]} />
                  </div>

                  {/* Overlapping text states */}
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      ref={(el) => {
                        textRefs.current[idx] = el;
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        willChange: 'transform, opacity',
                      }}
                    >
                      <FeatureContent
                        step={step}
                        onPrimaryCta={onPrimaryCta}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* MINIMAL VERTICAL PROGRESS DOTS: Far right edge of story section */}
            <div
              className="flex absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex-col items-center gap-1.5 sm:gap-2.5 lg:gap-3"
              aria-hidden="true"
            >
              {steps.map((_, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{
                    backgroundColor: i === 0 ? '#171717' : '#D4D4D4',
                    transform: i === 0 ? 'scale(1.3)' : 'scale(1)',
                    willChange: 'transform, background-color',
                  }}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
