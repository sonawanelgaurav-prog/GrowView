import React from 'react';
import { BusinessProfile, FrameId, FooterFrameConfig } from '../types';
import { FooterFrameRenderer } from './frames/FooterFrameRenderer';

interface BrandFrameProps {
  frameId: FrameId;
  profile: BusinessProfile;
  config?: Partial<FooterFrameConfig>;
  accentColor?: string;
  className?: string;
  isPosterBackgroundDark?: boolean;
  isHighResExport?: boolean;
}

export const BrandFrameRenderer: React.FC<BrandFrameProps> = ({
  frameId,
  profile,
  config = {},
  accentColor = '#f59e0b',
  className = '',
  isPosterBackgroundDark = true,
  isHighResExport = false,
}) => {
  return (
    <FooterFrameRenderer
      frameId={frameId}
      profile={profile}
      config={config}
      accentColor={accentColor}
      className={className}
      isPosterBackgroundDark={isPosterBackgroundDark}
      isHighResExport={isHighResExport}
    />
  );
};
