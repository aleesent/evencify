import React from 'react';
import { ScrollStorySection } from './scroll-story/ScrollStorySection';
import { crewStorySteps } from './scroll-story/storyData';

interface ForCrewSectionProps {
  onJoinAsCrew?: () => void;
  onJoinCrew?: () => void;
}

export const ForCrewSection: React.FC<ForCrewSectionProps> = ({
  onJoinAsCrew,
  onJoinCrew,
}) => {
  const handleCta = onJoinCrew || onJoinAsCrew;

  // Bind CTA callback to steps
  const stepsWithActions = crewStorySteps.map((step) => ({
    ...step,
    ctaAction: handleCta,
  }));

  return (
    <ScrollStorySection
      id="for-crew"
      theme="crew"
      sectionBadge="HOW IT WORKS FOR CREW"
      steps={stepsWithActions}
      primaryCtaText="Join Evencify as Crew"
      onPrimaryCta={handleCta}
    />
  );
};
