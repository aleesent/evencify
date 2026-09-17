import React from 'react';
import { StoryStep } from './types';

interface FeatureContentProps {
  step: StoryStep;
  totalSteps?: number;
  onPrimaryCta?: () => void;
}

export const FeatureContent: React.FC<FeatureContentProps> = ({
  step,
  onPrimaryCta,
}) => {
  return (
    <div className="flex flex-col justify-center text-black max-w-lg select-none">
      {/* Editorial Headline with Distinct Type Styling */}
      <h3 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-[36px] font-black tracking-tight text-neutral-900 leading-tight sm:leading-[1.15]">
        {step.titleLead ? (
          <>
            {step.titleLead}{' '}
            <span className="font-serif italic font-normal text-neutral-800 underline decoration-neutral-300/80 underline-offset-4">
              {step.titleAccent}
            </span>
            {step.titleTrail || ''}
          </>
        ) : (
          step.title
        )}
      </h3>

      {/* 3. Description with Highlighted Micro-Typography */}
      <p className="text-[11px] xs:text-xs sm:text-sm md:text-base text-neutral-600 font-normal leading-snug sm:leading-relaxed mt-1 sm:mt-2.5 max-w-md">
        {step.descriptionLead ? (
          <>
            {step.descriptionLead}{' '}
            <span className="font-bold text-neutral-900 bg-neutral-100/90 px-1 py-0.5 rounded border border-neutral-200/60">
              {step.descriptionHighlight}
            </span>{' '}
            {step.descriptionTrail || ''}
          </>
        ) : (
          step.description
        )}
      </p>

      {/* 4. Monospace Audit / Security Stamp */}
      {step.metaStamp && (
        <div className="mt-1 sm:mt-2 flex items-center gap-1.5">
          <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-wider text-neutral-500 uppercase">
            {step.metaStamp}
          </span>
        </div>
      )}

      {/* 5. Minimal Action Link */}
      {step.ctaText && (
        <div className="mt-2 sm:mt-4">
          <button
            onClick={step.ctaAction || onPrimaryCta}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-black hover:text-neutral-600 transition-colors cursor-pointer group"
          >
            <span className="border-b border-black pb-0.5 group-hover:border-neutral-500">
              {step.ctaText}
            </span>
            <span className="transition-transform group-hover:translate-x-1 font-mono text-sm">
              →
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
