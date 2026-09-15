import React from 'react';
import { ScrollStorySection } from './scroll-story/ScrollStorySection';
import { organiserStorySteps } from './scroll-story/storyData';

interface ForOrganisersSectionProps {
  onJoinAsOrganiser?: () => void;
  onHireCrew?: () => void;
}

export const ForOrganisersSection: React.FC<ForOrganisersSectionProps> = ({
  onJoinAsOrganiser,
  onHireCrew,
}) => {
  const handleCta = onHireCrew || onJoinAsOrganiser;

  const stepsWithActions = organiserStorySteps.map((step) => ({
    ...step,
    ctaAction: handleCta,
  }));

  return (
    <ScrollStorySection
      id="for-organisers"
      theme="organiser"
      sectionBadge="HOW IT WORKS FOR ORGANISERS"
      steps={stepsWithActions}
      primaryCtaText="Hire Verified Crew"
      onPrimaryCta={handleCta}
    />
  );
};
