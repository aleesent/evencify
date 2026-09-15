import React from 'react';
import { StoryStep } from './types';

interface StepIndicatorProps {
  steps: StoryStep[];
  activeStep: number;
  onSelectStep?: (index: number) => void;
  orientation?: 'vertical' | 'horizontal';
  theme?: 'crew' | 'organiser';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  activeStep,
  onSelectStep,
  orientation = 'vertical',
  theme = 'crew',
}) => {
  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep?.(idx)}
              aria-label={`Go to step ${step.stepNumber}: ${step.category}`}
              className={`group flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FED000] text-black border border-black shadow-[1px_1px_0px_#000000]'
                  : 'bg-white text-black/60 border border-black/20 hover:text-black hover:border-black'
              }`}
            >
              <span>{step.stepNumber}</span>
              {isActive && (
                <span className="hidden sm:inline-block max-w-[90px] truncate text-[10px] uppercase tracking-wider font-extrabold ml-1">
                  {step.category}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Vertical layout for desktop right side or gutter
  return (
    <div className="flex flex-col gap-2.5" role="tablist" aria-label="Story steps">
      {steps.map((step, idx) => {
        const isActive = idx === activeStep;
        return (
          <button
            key={step.id}
            onClick={() => onSelectStep?.(idx)}
            aria-label={`Go to step ${step.stepNumber}: ${step.category}`}
            role="tab"
            aria-selected={isActive}
            className={`group flex items-center gap-3 text-left transition-all cursor-pointer ${
              isActive ? 'opacity-100' : 'opacity-40 hover:opacity-75'
            }`}
          >
            {/* Dot / Pill Indicator */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all border-2 border-black ${
                isActive
                  ? 'bg-[#FED000] text-black scale-110 shadow-[2px_2px_0px_#000000]'
                  : 'bg-white text-black group-hover:bg-[#FFFDE6]'
              }`}
            >
              {step.stepNumber}
            </div>

            {/* Label (visible on large screens) */}
            <div className="hidden xl:block">
              <div
                className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                  isActive ? 'text-black' : 'text-neutral-600'
                }`}
              >
                {step.category}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
