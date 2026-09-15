import React from 'react';

export type StoryVisualType =
  | 'crew-profile'
  | 'crew-discovery'
  | 'crew-search'
  | 'crew-apply'
  | 'crew-track'
  | 'crew-reputation'
  | 'organiser-create'
  | 'organiser-criteria'
  | 'organiser-discovery'
  | 'organiser-inbox'
  | 'organiser-shortlist'
  | 'organiser-roster';

export interface StoryStep {
  id: string;
  stepNumber: string; // "01", "02", etc.
  category: string; // e.g. "BUILD YOUR PROFILE"
  categoryCode?: string; // e.g. "DOC-ID // 01"
  title: string; // fallback clean string
  titleLead: string;
  titleAccent: string;
  titleTrail?: string;
  description: string; // fallback clean string
  descriptionLead: string;
  descriptionHighlight: string;
  descriptionTrail?: string;
  metaStamp?: string; // e.g. "KYC: VERIFIED • TIER-1"
  badge?: string;
  keyPoints?: string[];
  ctaText?: string;
  ctaAction?: () => void;
  visualType: StoryVisualType;
}

export interface ScrollStorySectionProps {
  id: string;
  theme?: 'crew' | 'organiser';
  sectionBadge?: string;
  sectionTitle?: string;
  sectionTitleHighlight?: string;
  sectionDescription?: string;
  steps: StoryStep[];
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
}
